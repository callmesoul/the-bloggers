'use strict';
const { sanitizeEntity } = require('strapi-utils')
const Url = require('url')
let Parser = require('rss-parser')

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    let entities 
    if (ctx.query.all) {
      entities = await strapi.services.website.find({ status: 2, _sort: 'created_at:desc' })
    } else{
      entities = await strapi.services.website.find({ ...ctx.query, user: ctx.state.user.id, _sort: 'created_at:desc' })
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.website }));
  },
  async create(ctx) {
    // 根据rssUrl 获取网站信息
    const parser = new Parser()
    const website = await parser.parseURL(ctx.request.body.rssUrl)
    const url = Url.parse(ctx.request.body.rssUrl)
    const entity = await strapi.services.website.create({ name: website.title, link: `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`, description: website.description, ...ctx.request.body, user: ctx.state.user.id })
    return sanitizeEntity(entity, { model: strapi.models.website })
  },

  async update(ctx) {
    const { id } = ctx.params;
    const website = await strapi.services.website.findOne({ id })
    //  如果更新了 rssurl 要把旧的移除再加新的
    let params = ctx.request.body
    const parser = new Parser()
    const res = await parser.parseURL(params.rssUrl).catch(() => {
      ctx.status = 400
      return ctx.body = {
        message: 'rssUrl 请求失败'
      } 
    })
    if (res.title) {
      params.name = res.title
      params.link = res.link
      params.description = res.description
      
      
      if (params && params.rssUrl === website.rssUrl && website.status === 3) {
        params.status = 1
      }
      if (params && params.rssUrl !== website.rssUrl){
        // 需要重新审核
        params.status = 0
        // 取消订阅旧 的rss
        strapi.feeder.remove(website.rssUrl)
      }
      const entity = await strapi.services.website.update({ id }, params)
      return sanitizeEntity(entity, { model: strapi.models.website });
    } else {
      ctx.status = 400
      ctx.body = {
        message: 'RSSUrl 请求失败'
      }
    }
  }
}
