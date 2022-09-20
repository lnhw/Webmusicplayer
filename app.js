const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const btnPlay = $(".btn-toggle-play");
const progress = $("#progress");
const repaet = $(".btn-repeat");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRanDom = $(".btn-random");
const song = $(".song");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRanDom: false,
  isLoop: false,

  songs: [
    {
      name: "Cho-iu-Chill-Tien-Tien-De-Choat",
      singer: "Cho-iu-Chill-Tien-Tien-De-Choat ",
      path: "/assets/music/-Chờ-iu CHILL- - Tiên Tiên x Dế Choắt by TIEN TIEN.mp3",
      image:
        "https://i.pinimg.com/564x/f4/c6/04/f4c604a63710f724e6a7de41d0b8f5c5.jpg",
    },
    {
      name: "Softy  Evening Sky",
      singer: "Jordy Chandra ",
      path: "./assets/music/Jordy Chandra  Softy  Evening Sky.mp3",
      image:
        "https://i.pinimg.com/564x/fe/90/ed/fe90eda80e52ea0c411f9ff3c357088a.jpg",
    },
    {
      name: "Sometimes Things Go Wrong",
      singer: "Jordy Chandra ",
      path: "./assets/music/Jordy Chandra  Sometimes Things Go Wrong.mp3",
      image:
        "https://i.pinimg.com/564x/fb/56/c8/fb56c8c5a857f7c0ab8134b13ea7bb91.jpg",
    },
    {
      name: "Talking With You on a Rainy Day",
      singer: "Jordy Chandra ",
      path: "./assets/music/Jordy Chandra  Talking With You on a Rainy Day.mp3",
      image:
        "https://i.pinimg.com/564x/d0/8d/db/d08ddbf19d47332e57d3c16bb2b6f389.jpg",
    },
    {
      name: "Will You Stay With Me",
      singer: "Jordy Chandra ",
      path: "./assets/music/Jordy Chandra  Will You Stay With Me .mp3",
      image:
        "https://i.pinimg.com/736x/0b/9f/b1/0b9fb14a69f26ab63719f21803425875.jpg",
    },
    {
      name: "I Want You but Not Now",
      singer: "Jordy Chandra ",
      path: "./assets/music/Jordy Chandra  I Want You but Not Now.mp3",
      image:
        "https://i.pinimg.com/736x/5d/ad/0a/5dad0acaa1c536dcf9ff7af330ec29a3.jpg",
    },
  ],
  render: function () {
    // var n = this.currentIndex;
    const _this = this;
    const htmls = this.songs.map(function (song, index) {
      // const _indec = n;
      return `
             <div class="song ${
               index === _this.currentIndex ? "active" : ""
             }" data-result=${index}>
                <div class="thumb" style="background-image: url('${
                  song.image
                }')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    //để lưu cái biến bên ngoài handleEvent vào _this này
    const _this = this;
    const cdWidth = cd.offsetWidth;
    //xử lý phóng to thu nhỏ
    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;
      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };
    // xử lý cd quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    // xử lý khi click play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
        cdThumbAnimate.pause();
      } else {
        cdThumbAnimate.play();
        audio.play();
      }
    };

    // khi song play
    audio.onplay = () => {
      _this.isPlaying = true;
      player.classList.add("playing");
    };
    //lhi song pause
    audio.onpause = () => {
      _this.isPlaying = false;
      player.classList.remove("playing");
    };

    // xử lý  tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPrecent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPrecent;
      }
    };
    song.onclick = function (e) {};
    //xử lý tua bai` hat
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    // next song
    btnNext.onclick = function (e) {
      if (_this.isRanDom) {
        _this.playRanDomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      console.log(song);
      _this.render();
    };

    // prev song
    btnPrev.onclick = function () {
      if (_this.isRanDom) {
        _this.playRanDomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
    };
    // xử lý bật tắt random
    btnRanDom.onclick = function (e) {
      _this.isRanDom = !_this.isRanDom;
      btnRanDom.classList.toggle("active", _this.isRanDom);
    };
    // xử lý next song khi audio ended
    audio.onended = function () {
      if (_this.isLoop) {
        audio.play();
      } else {
        btnNext.click();
      }
    };
    // Repaet song
    repaet.onclick = function () {
      _this.isLoop = !_this.isLoop;
      repaet.classList.toggle("active", _this.isLoop);
    };
  },
  srrollActions: function () {
    setTimeout(function () {
      $(".song.active").scrollintoView({
        behavior: "smootb",
        block: "nearest",
      });
    }, 3000);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRanDomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();
    //Lắng nghe / xử lý các sự kiện(DOM events)
    this.handleEvent();
    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    //Render playlist song
    this.render();
  },
};
app.start();
