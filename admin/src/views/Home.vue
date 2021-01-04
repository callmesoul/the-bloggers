<template>
  <div class="home">
    <div class="header">
      <h1>The Bloggers</h1>
      <h4><b>博客者联盟</b>，简称<b>‘博联’</b>，哈哈笑死我了</h4>
      <i>
        友情链接的升级版!
        <br />
        通过调用api的形式，智能匹配联盟内所有博客关联的文章进行推荐
      </i>
    </div>
    <div class="power">
      <h2>优势：</h2>
      <ol>
        <li><b>关联性强</b>-根据当前文章标题内容等智能匹配关联文章（前期加入的网站较少，匹配会少，没有匹配的情况下按热度推荐），摆脱可用性较小的友情链接</li>
        <li><b>可定制性强</b>-api接口形式调用，样式随你写</li>
        <li><b>兼容性强</b>-api接口形式调用，不限博客框架能调用api接口行；通过RSS抓取文章，按照样本生成RSS即可</li>
      </ol>
    </div>
    <div class="notice">
      <h2>使用：</h2>
      <ol>
        <li>在<a>这里</a>自己博客的RSS地址</li>
        <li>在自己博客文章里调用关联api，编写对应UI</li>
        <li>等待审核即可</li>
      </ol>
    </div>
    <div class="notice">
      <h2>审核通过条件：</h2>
      <ol>
        <li>原创（必须）</li>
        <li>可良好阅读(界面上保证基本的可阅读行和排版)</li>
      </ol>
    </div>
    <div>
      <button>立即加入<b>The bloggers</b></button>
    </div>

    <div class="users">
      <h2>联盟成员:</h2>
      <ul>
        <li v-for="website in websites">
          <p><a :href="website.link" target="_blank">{{ website.name }}</a></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Login } from '../api/user'
  import { Find } from '../api/website'
  export default {
    name: 'Home',
    props: {
      msg: String
    },
    data() {
      return {
        count: 0,
        websites: []
      }
    },
    async created () {
      this.websites = await Find()
    }
  }
</script>

<style lang="scss">
  .home{
    text-align: left;
    width: 800px;
    margin: 0 auto;
    .header{
      text-align: center;
    }
  }
</style>
  