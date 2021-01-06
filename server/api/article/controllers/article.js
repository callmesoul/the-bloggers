'use strict';
const { sanitizeEntity } = require('strapi-utils')
const AnalysisArticle = require("../../../config/functions/analysis-article");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async recommend (ctx) {
    let { title, content, guid, limit } = ctx.query
    if (!title || (title && title === '')) {
      ctx.status = 400
      ctx.body = {
        msg: '请传入文章标题title字段'
      }
      return
    }
    if (!guid || (guid && guid === '')) {
      ctx.status = 400
      ctx.body = {
        msg: '请传入文章唯一标识guid字段'
      }
      return
    }
    if (!limit) {
      limit = 12
    }
    // 异步更新对应网站状态
    strapi.services.website.findOne({ link: ctx.request.header.origin }).then((website) => {
      if (website) {
        // 0 为审核 2 正常 3 rssurl 错误
        if (website.status != 0 && website.status != 2 && website.status != 3) {
          strapi.services.website.update({ id: website.id }, { status: 2 }).then(() => {
            strapi.feeder.add({
              url: website.rssUrl,
              refresh: 60 * 1000
            })
          })
        }
      }
    })
    // if (guid) {
    //   const article = await strapi.services.article.findOne({ guid})
    //   if (article) {
    //     website = await strapi.services.website.findOne({ id: article.website.id })
    //   }
    // }
    

    
    // keywords
    const keywords = await AnalysisArticle.getKeywords(title)
    const keywordDatas = await await strapi.services.keyword.find({ 'name_in': keywords, '_limit': limit, _where: [ {'articles.website.status': 2}] }, ["articles.website", "articles.website.status"]);
    let articles = []
    keywordDatas.forEach(keyword => {
      articles = articles.concat(keyword.articles)
    });

    // phrases
    let phrases = []
    if (content) {
      phrases = await AnalysisArticle.getPhrases(content)
    }
    if (phrases.length > 0) {
      const phraseDatas = await await strapi.services.phrase.find({ 'name_in': phrases, '_limit': limit, _where: [ {'articles.website.status': 2}] }, ["articles.website", "articles.website.status"]);
      phraseDatas.forEach(phrase => {
        articles = articles.concat(phrase.articles)
      });
    }

    
    // 所有关联的文章 根据重复次数排序且去重
    // 组合文章个数
    let artilcesCount = []
    articles.forEach(article => {
      const index = artilcesCount.findIndex(item => item.article.id === article.id)
      if (index === -1) {
        artilcesCount.push({ article, count: 1 })
      } else {
        artilcesCount[index].count++ 
      }
    })
    // 根据个数排序
    artilcesCount.sort((a, b) => {
      if (a.count > b.count ) { return -1 }
      else if (a.count === b.count ) { return 0 }
      else if (a.count < b.count ) { return 1 }
    })
    let result = []
    const articleIds = []
    artilcesCount.forEach(item => {
      result.push(item.article)
      articleIds.push(item.article.id)
    })
    // 异步每篇文章的关联系数
    result.map(article => {
      strapi.services.article.update({ id: article.id }, { count: article.count + 1 })
    })
    if (result.length > limit) {
      result.splice(limit - 1, result.length - limit)
    } else if(result.length < limit) {
      const hotArticles = await strapi.services.article.find({ '_limit': limit - result.length, 'id_nin': articleIds, '_sort': 'count:DESC', _where: [ {'website.status': 2}] })
      result = result.concat(hotArticles)
    }
    ctx.body = result
  },

  async find (ctx) {
    const entities = await strapi.services.article.find({  _where: { 'website.user': ctx.state.user.id } })
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.article }));
  }
}
