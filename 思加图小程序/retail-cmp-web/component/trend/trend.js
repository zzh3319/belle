// pages/template/trend/trend.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '',
      observer: (newVal, oldVal) => {
        console.log(newVal);
      }
    },
    subTitle: {
      type: String,
      value: '',
      observer: (newVal, oldVal) => {
        console.log(oldVal);
      }
    },
    tag: {
      type: String,
      value: '',
      observer: (newVal, oldVal) => {
        console.log(oldVal);
      }
    },
    img: {
      type: String,
      value: '',
      observer: (newVal, oldVal) => {
        console.log(oldVal);
      }
    },
    url: {
      type: String,
      value: '',
      observer: (newVal, oldVal) => {
        console.log(oldVal);
      }
    },
    data:{
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
