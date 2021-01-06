"use strict";
const Queue = require("bullmq").Queue;
const Worker = require("bullmq").Worker;
const RssFeedEmitter = require("rss-feed-emitter");
const Url = require('url')
const AnalysisArticle = require("../../config/functions/analysis-article");

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = async (ctx) => {
  // 初始化 添加新文章队列
  const addArticleQueue = new Queue("AddArticle");
  // 添加新文章队列任务
  const worker = new Worker("AddArticle", async (job) => {
    await addArticle(job.data);
  });
  // 初始化 rss 订阅
  strapi.feeder = new RssFeedEmitter();
  // 获取所有正常网站
  const websites = await strapi.services.website.find({ status: 2 });
  websites.forEach((website) => {
    // 把每个网站的rss地址添加到订阅
    strapi.feeder.add({
      url: website.rssUrl,
      refresh: 60 * 1000,
    });
  });

  //  新文章订阅监听
  strapi.feeder.on("new-item", async (item) => {
    // 添加到新文章任务队列
    addArticleQueue.add(item.guid, item);
  });

  // 错误监听
  strapi.feeder.on("error", (error) => {
    // 修改对应网站的状态
    strapi.services.website.update({ rssUrl: error.feed }, { status: 3 });
    // 移除订阅
    strapi.feeder.remove(error.feed);
  });

  function addArticle(item) {
    return new Promise(async (resolve) => {
      console.log("addArticle");
      // 文章是否已存在
      let article = await strapi.services.article.findOne({ guid: item.guid });
      // 网站对应文章已存在则 return
      if (article && article.website.rssUrl === item.meta.link) {
        resolve()
      } else {
        const website = await strapi.services.website.findOne({
          rssUrl: item.meta.link,
        });
        let cover = ''
        if (item.enclosures && item.enclosures[0] && item.enclosures[0].type && item.enclosures[0].type.indexOf("image") !== -1) {
          cover = item.enclosures[0].url
        }
        // 不存在 则先插入文章
        const params = {
          title: item.title,
          content: item.description,
          description: item.summary,
          pubDate: item.pubDate,
          website: website.id,
          link: item.link,
          guid: item.guid,
          author: item.author,
          categories: item.categories,
          cover
        };
        article = await strapi.services.article.create(params);
  
        /* 处理关键词 */
        const keywords = await AnalysisArticle.getKeywords(item.title);
        if (keywords && keywords.length > 0) {
          keywords.forEach(async (keyword) => {
            await SetArticleValue(keyword, article.id, "keyword");
          });
        }
  
        //  目录分类 也作为 关键词
        if (item.categories.length > 0) {
          item.categories.forEach(async (word) => {
            await SetArticleValue(word.toLowerCase(), article.id, "keyword");
          });
        }
  
        // 提取短句
        const phrases = await AnalysisArticle.getPhrases(item.description);
        if (phrases && phrases.length > 0) {
          phrases.forEach(async (phrase) => {
            await SetArticleValue(phrase, article.id, "phrase");
          });
        }
        resolve()
      }
    });
  }

  function SetArticleValue(value, articleId, type) {
    return new Promise(async (resolve) => {
      let result = await strapi.services[type].findOne({ name: value });
      if (!result) {
        result = await strapi.services[type].create({ name: value });
      }
      const article = await strapi.services.article.findOne({ id: articleId });

      const ids = [];
      article[type + "s"].forEach((item) => {
        ids.push(item.id);
      });
      const index = ids.findIndex((item) => item === result.id);
      if (index === -1) {
        await strapi.services.article.update(
          { id: articleId },
          { [`${type}s`]: [...ids, result.id] }
        );
      }
      resolve();
    });
  }
};
