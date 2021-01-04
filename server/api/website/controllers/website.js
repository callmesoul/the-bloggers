'use strict';
const { sanitizeEntity } = require('strapi-utils')
let Parser = require('rss-parser');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    // 根据rssUrl 获取网站信息
    const parser = new Parser()
    const website = await parser.parseURL(ctx.request.body.rssUrl)
    const entity = await strapi.services.website.create({ name: website.title, link: website.link, description: website.description, ...ctx.request.body })
    return sanitizeEntity(entity, { model: strapi.models.website })
  },

  async update(ctx) {
    const { id } = ctx.params;
    const website = await strapi.services.website.findOne({ id })
    //  如果更新了 rssurl 要把旧的移除再加新的
    let params = ctx.request.body
    if (params && params.rssUrl != website.rssUrl){
      strapi.feeder.remove(website.rssUrl)
      strapi.feeder.add({
        url: params.rssUrl,
        refresh: 60 * 1000
      })
      const parser = new Parser()
      const res = await parser.parseURL(params.rssUrl)
      if (res) {
        params.name = res.title
        params.link = res.link
        params.description = res.description
      }
      // 需要重新审核
      params.status = 0
    }
    const entity = await strapi.services.website.update({ id }, params)
    return sanitizeEntity(entity, { model: strapi.models.website });
  }
}
