const audio = wx.getBackgroundAudioManager()
const {
  globalData
} = getApp()
Page({
  data: {
    musics: [],
    /* 记录点击之后的id */
    prevId: "",
    /* 记录音乐是否播放 */
    isPlay: false
  },
  onLoad() {

  },
  handleSubmit(event) {
    var keyword = event.detail.value.keyword;
    wx.showLoading({
      title:"数据正在加载中"
    });
    wx.request({
      url: `http://192.168.14.49:3000/search?keywords=${keyword}`,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        var songs = res.data.result.songs;
        var musics = []
        console.log(1)
        songs.forEach(item => {
          var obj = {};
          obj.name = item.name;
          obj.id = item.id;
          /* 0.2s */
          wx.request({
            url: `https://music.aityp.com/song/detail?ids=${item.id}`,
            header: {'content-type':'application/json'},
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (res)=>{
              console.log(2)
              obj.picUrl = res.data.songs[0].al.picUrl;
            }
          });
          
          obj.artistName = item.artists[0].name;
          obj.time = item.duration;
          obj.musicUrl = `https://music.163.com/song/media/outer/url?id=${item.id}`
          musics.push(obj)
        })
        console.log(3)
        this.setData({
          musics
        })
        wx.hideLoading();
      }
    });
  },
  handlePlay(event) {
    var {index} = event.currentTarget.dataset
    var {id,name,musicUrl} = this.data.musics[index];
    if (id !== this.data.prevId) {
      audio.title = name;
      audio.src = musicUrl;
      this.setData({
        isPlay: true,
        prevId: id
      })
    } else {
      /* 点击之后,将id设置给prevId */
      if(this.data.isPlay){
        audio.pause();
        this.setData({
          isPlay:false
        })
      }else{
        audio.title = name;
        audio.src = musicUrl;
        this.setData({
          isPlay:true
        })
      }
    }
  }

})