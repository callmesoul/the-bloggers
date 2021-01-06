const FormData = require("form-data");
const Axios = require("axios");
const axios = Axios.create({
  baseURL: "http://comdo.hanlp.com/hanlp",
});
module.exports = {
  //  获取关键词
  getKeywords(title) {
    return new Promise(async (resolve, reject) => {
      let count =
        Math.ceil(title.length / 2) > 5 ? 5 : Math.ceil(title.length / 2);
      // 通过标题提取 5 个关键词
      const formData = new FormData();
      formData.append("text", title);
      formData.append("size", count);
      const res = await axios.post(
        "/v1/keyword/extract",
        formData.getBuffer(),
        {
          headers: {
            ...formData.getHeaders(),
            token: process.env.HANLP_KEYWORD_TOKEN,
          },
        }
      );
      if (res.data && res.data.data) {
        const keywords = [];
        res.data.data.forEach(async (item) => {
          // 去除特殊字符
          item.word = item.word.replace(/[^a-zA-Z_\u4e00-\u9fa5]/g, "");
          // 去开头和结果的 — _ 字符
          if (item.word.indexOf("-") === 0) {
            item.word = item.word.replace(/-/, "");
          }
          if (item.word.indexOf("-") === item.word.length - 1) {
            item.word = item.word.slice(0, item.word.length - 1);
          }
          if (item.word.indexOf("_") === 0) {
            item.word = item.word.replace(/_/, "");
          }
          if (item.word.indexOf("_") === item.word.length - 1) {
            item.word = item.word.slice(0, item.word.length - 1);
          }
          item.word = item.word.toLowerCase();
          item.word = item.word.trim();
          const keyword = keywords.find((_item) => _item === item.word);
          if (!keyword) {
            keywords.push(item.word);
          }
        });
        resolve(keywords);
      } else {
        reject(err);
      }
    });
  },

  // 获取短句
  getPhrases(content) {
    return new Promise(async (resolve, reject) => {
      // 提取短句
      if (content.length > 50) {
        const formData = new FormData();
        formData.append("size", 5);
        formData.append("text", content);
        const response = await axios.post(
          "/v1/phrase/extract",
          formData.getBuffer(),
          {
            headers: {
              ...formData.getHeaders(),
              token: process.env.HANLP_PHRASE_TOKEN,
            },
          }
        );
        if (response.data && response.data.data) {
          const phrases = [];
          response.data.data.forEach(async (item) => {
            item.word = item.word.toLowerCase();
            item.word = item.word.trim();
            const phrase = phrases.find((_item) => _item === item.word);
            if (!phrase) {
              phrases.push(item.word);
            }
          });
          resolve(phrases);
        } else {
          reject(error);
        }
      } else {
        resolve([]);
      }
    });
  },
};
