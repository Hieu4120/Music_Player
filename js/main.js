/*
1.Render song
2.Scroll top(keo len bao nhieu thi thu nho lai bay nhieu)
3.Play / Pause / Seek
4.CD rotate
5. Next / prev
6.Random
7.Next / Reapeat When ended
8.Activ song
9.Scroll active song into view
10.Play song when click

 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY= 'F8_PLAYER'
//lay ra html cua cac class or id
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $("#progress")//thanh tien trinh bai hat
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList =   $('.playlist')
const app ={
    currentIndex :0,//lay ra chi muc dau tien cua mang
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
   config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    
songs: [
    {
        name: 'Perfect',
        singer:'Ed-Shreen',
        path: './music/song1.mp3',
        image: './img/song1.jpg'
    },
    {
        name: 'Photograph ',
        singer:'Ed-Shreen',
        path: './music/song2.mp3',
        image: './img/song2.jpg'
    },
    {
        name: 'Bad Habits',
        singer:'Ed-Shreen',
        path: './music/song3.mp3',
        image: './img/song3.jpg'
    },
    {
        name: 'Shivers',
        singer:'Ed-Shreen',
        path: './music/song4.mp3',
        image: './img/song4.jpg'
    },
    {
        name: 'Shape Of You',
        singer:'Ed-Shreen',
        path: './music/song5.mp3',
        image: './img/song5.jpg'
    }, 
    {
        name: 'Montero',
        singer:'Lil Nas X',
        path: './music/song6.mp3',
        image: './img/song6.jpg'
    },  
    {
        name: 'Into your arms',
        singer:'Ava max',
        path: './music/song7.mp3',
        image: './img/song7.jpg'
    }, 
    {
        name: '7 years',
        singer:'Lukas Graham',
        path: './music/song8.mp3',
        image: './img/song8.jpg'
    }, 
    {
        name: 'Unstoppable',
        singer:'Sia',
        path: './music/song9.mp3',
        image: './img/song9.jpg'
    }, 
    {
        name: 'Lovely',
        singer:'Billie Eilish; Khalid',
        path: './music/song10.mp3',
        image: './img/song10.jpg'
    }, 
    ],
    setConfig: function(key,value){
        this.config[key] =value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    // 1.Render song 
    render: function(){
        const htmls = this.songs.map((song, index) =>{
            return`
            <div class="song ${index === this.currentIndex ? 'active' :''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
      playList.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{//dinh nghia ra properties currentSong
            get:function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    //cu lang su kien thi lang nghe trong day
    handleEvent: function(){//luu this ben ngoai handleEvent vao _this
        const _this = this//
        const cdWidth = cd.offsetWidth// tra doc tren w3
        
        //Xu ly CD quay va dung 
       const cdThumbAnimate = cdThumb.animate ([
            {transform:'rotate(360deg)'}
        ],{
            duration:10000, //10 seconds
            iterations: Infinity //so lan lap
        })
        cdThumbAnimate.pause()

        //xu ly phong to thu nho cd
        document.onscroll = function(){// lang nghe su kien scroll theo truc doc
            
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth >0 ? newCdWidth +'px' : 0
            cd.style.opacity = newCdWidth / cdWidth // lam mo hinh anh khi keo len(opacitu co gtri tu 0 ->1)

        }

        //xu ly khi click play
        playBtn.onclick = function(){
        //dung this day k dc vi no k tra ra object app ma tra ra element play Btn
           if(_this.isPlaying) {
                audio.pause()            
           } else{
                audio.play()
           }
        }
           //khi bai hat dang dc play
           audio.onplay =function(){
               _this.isPlaying = true
               player.classList.add('playing')
               cdThumbAnimate.play()
           }

           //khi bai hat bi pause
           audio.onpause =function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
           }
           //update time khi tien do bai hat thay doi(len w3 htmlaudio)
           audio.ontimeupdate = function(){
               if(audio.duration){
                   //duration: Trả về thời lượng của âm thanh / video hiện tại (tính bằng giây)
                  //currentTime: Gan hoặc trả về vị trí phát lại hiện tại trong âm thanh / video (tính bằng giây)
                   const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                   progress.value = progressPercent
               }
            }
               //xu ly khi tua
            progress.onchange = function(e){
               const seekTime = audio.duration/ 100 * e.target.value
               audio.currentTime = seekTime
           }

           //Khi next song
           nextBtn.onclick = function(){
               if(_this.isRandom){
                _this.playRandomSong()
               }else{
                _this.nextSong()
               }              
               audio.play()
               _this.render()
               _this.scrollToActiveSong()
           }

           //Khi prev song
           prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
               }else{
                _this.prevSong()
               }
                 audio.play()
                 _this.render()
               _this.scrollToActiveSong()

            }

            //Xu ly bat/tat random song
            randomBtn.onclick = function(e){                
                _this.isRandom = !_this.isRandom   
                _this.setConfig('isRandom',_this.isRandom) 
                //toggle giup active khi an lan 1 va huy active khi an lan 2 (no sang len)          
                randomBtn.classList.toggle('active',_this.isRandom)               
            }

            //Xu ly phat lai 1 song
            repeatBtn.onclick = function(e){
                _this.isRepeat = !_this.isRepeat
                _this.setConfig('isRepeat',_this.isRepeat) 
               repeatBtn.classList.toggle('active',_this.isRepeat) 
            }

            //Xu ly next song khi ended
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play()
                }else{
                    nextBtn.click()
                }               
            }
            //Lang nghe click vao playList
            playList.onclick = function(e){
                const songNode = e.target.closest('.song:not(.active)')
                if (songNode || !e.target.closest('.option')){
                   //xu ly khi click vao song 
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        audio.play()
                        _this.render()
                    }
                    //Xu lys khi click vao song option
                    if(!e.target.closest('.option')){

                    }
                }
            }

    },
   scrollToActiveSong: function(){
    setTimeout(() =>{
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        })
    },300)
    
   },
    loadCurrentSong: function(){                
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
    //lon hon chieu dai mang songs thi se quay ve 0
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex <0){
            this.currentIndex = this.song.length-1
            //tra ve phan tu cuoi mang
        }
        this.loadCurrentSong()
    },

    playRandomSong: function(){
        let newIndex
        do{   
            //random key ngau nhien trong list song
            //neu random vao bai cu thi khong dc nen sd do while
           newIndex = Math.floor(Math.random()* this.songs.length) 
        }while(newIndex == this.currentIndex)// lap cho den khi no khong trung voi bai dang phat nua thi ngung
        this.currentIndex = newIndex
      this.loadCurrentSong()
    },

    start: function(){
        // Gan cai hinh tu config vao ung dung
        this.loadConfig()
    //dinh nghia cac thuoc tinh cho object playBtn(this thay cho app)
        this.defineProperties()
        //lang va xu ly cac event(Dom event)
        this.handleEvent()
        //tai thong tin bai hat dau tien vao giao dien khi chay

        this.loadCurrentSong()
        //2.Scroll topRender playlist
        this.render()
        //Hien thi trang thai ban dau cua button repeat va random
        repeatBtn.classList.toggle('active',this.isRepeat)
        randomBtn.classList.toggle('active',this.isRandom) 
    }  
}
app.start()
