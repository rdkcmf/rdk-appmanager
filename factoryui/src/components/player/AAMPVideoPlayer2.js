import { Lightning, Utils } from 'wpe-lightning-sdk'

var startTimer = null;
var stopTimer  = null;

/**
 * Class to render AAMP video player.
 */
export default class AAMPVideoPlayer2 extends Lightning.Component {
  /**
   * Function to render player controls.
   */
  static _template() {
    return {
      LoaderImg: {
        x: 0, y: 0,
        w: 1920,
        h: 1080,
        Loader: {
          mount: 0.5, x: 1920 / 2, y: 1080 / 2, src: Utils.asset('images/loader.png')
        }
      },
    }
  }

  _init()
  {
    // console.log('PLAYER:  Playback ... init() ! ')

    this.videoEl = document.createElement('video')
    this.videoEl.setAttribute('id', 'video-player')
    this.videoEl.style.position = 'absolute'
    this.videoEl.style.zIndex = '1'
    this.videoEl.setAttribute('width', '100%')
    this.videoEl.setAttribute('height', '100%')

    // this.videoEl.setAttribute('src', 'placeholder.mp4')

    this.videoEl.setAttribute('type', 'video/ave')

    document.body.appendChild(this.videoEl)

    this.playbackSpeeds = [-64, -32, -16, -4, 1, 4, 16, 32, 64]
    this.playerStatesEnum = { idle: 0, initializing: 1, playing: 8, paused: 6, seeking: 7 }
    this.player = null

    // Create the PLAYER
    this.createPlayer()

    this.playbackRateIndex = this.playbackSpeeds.indexOf(1)
    this.defaultInitConfig =
    {
      initialBitrate: 2500000,
      offset: 0,
      networkTimeout: 10,
      preferredAudioLanguage: 'en',
      liveOffset: 15,
      drmConfig: null
    }

    this.loadingAnimation = this.tag('Loader').animation({
      duration: 1, repeat: -1, stopMethod: 'immediate', stopDelay: 0.2, actions: [
        { p: 'rotation', v: { sm: 0, 0: 0, 1: Math.PI * 2 } },
      ]
    });
    this.loadingAnimation.play();
  }

  /**
   * Function to set video coordinates.
   * @param {int} x  ... x - of video
   * @param {int} y  ... y - of video
   * @param {int} w  ... w - of video
   * @param {int} h  ... h - of video
   */
  setVideoRect(x, y, w, h)
  {
    if(this.player)
    {
      let xPos = 0.67 * x
      var yPos = 0.67 * y
      var wPos = 0.67 * w
      var hPos = 0.67 * h

      this.player.setVideoRect(xPos, yPos, wPos, hPos)
    }
    else
    {
      console.log('PLAYER:  Playback ... setVideoRect() >>>  No Player  !!!!' )
    }
  }


  /**
   * Event handler to store the current playback state.
   * @param  event playback state of the video.
   */
  _playbackStateChanged(event)
  {
    console.log('PLAYER:  State  >> ' + JSON.stringify(event) )
    console.log('PLAYER:  State  >> ' + JSON.stringify(event) )
    console.log('PLAYER:  State  >> ' + JSON.stringify(event) )
  }


  /**
   * Event handler to handle the event of completion of a video playback.
   */
  _mediaEndReached()
  {
    console.log('PLAYER:  Finished  >> FIRE >> mediaPlackbackEnded ')
    console.log('PLAYER:  Finished  >> FIRE >> mediaPlackbackEnded ')
    console.log('PLAYER:  Finished  >> FIRE >> mediaPlackbackEnded ')

    this.player.stop()
    this.fireAncestors('$mediaPlackbackEnded')

    console.log('PLAYER:  Playback ... Ended >> FIRE  >>> $mediaPlackbackEnded')
    console.log('PLAYER:  Playback ... Ended >> FIRE  >>> $mediaPlackbackEnded')
    console.log('PLAYER:  Playback ... Ended >> FIRE  >>> $mediaPlackbackEnded')
  }

  /**
   * Event handler to handle the event of changing the playback speed.
   */
  _mediaSpeedChanged()
  {
    console.log('PLAYER:  GOT >> _mediaSpeedChanged ')

  }

  /**
   * Event handler to handle the event of bit rate change.
   */
  _bitrateChanged() {}

  /**
   * Function to handle the event of playback failure.
   */
  _mediaPlaybackFailed()
  {
    console.log('PLAYER:  Playback ... FAILED ! ')

    this.load(this.videoInfo)
  }

  /**
   * Function to handle the event of playback progress.
   * @param event playback event.
   */
  _mediaProgressUpdate(event)
  {
    this.position_sec = event.positionMiliseconds / 1000

    console.log('PLAYER:  Playback ... this.position_sec: ' + this.position_sec + ' of ' + this.videoInfo.endTime + ' sec ')

    if (this.position_sec >= this.videoInfo.endTime)
    {
      this.stop()
      this.fireAncestors('$mediaPlackbackEnded')

      console.log('PLAYER:  Playback ... Progress >> FIRE  >>> $mediaPlackbackEnded')
      console.log('PLAYER:  Playback ... Progress >> FIRE  >>> $mediaPlackbackEnded')
      console.log('PLAYER:  Playback ... Progress >> FIRE  >>> $mediaPlackbackEnded')
    }
  }

  /**
   * Function to handle the event of starting the playback.
   */

  _mediaPlaybackStarted()
  {
    this.tag('LoaderImg').alpha = false
    this.player.setVolume(0)

    // Fade in Audio
    //
    if(startTimer == null)
    {
      startTimer = setInterval( () =>
      {
        if ((this.player.getVolume() + 20) < 100)
        {
          console.log('PLAYER:  Playback ... _mediaPlaybackStarted() >>>  fade IN audio' )

          this.player.setVolume(this.player.getVolume() + 20)
        }
        else
        {
          this.player.setVolume(100)

          clearInterval(startTimer)
          startTimer = null
        }
      }, 500)
    }
  }

  /**
   * Function to handle the event of change in the duration of the playback content.
   */
  _mediaDurationChanged() {}

  /**
   * Function to create the video player instance for video playback and its initial settings.
   */
  createPlayer()
  {
    if (this.player !== null)
    {
      console.log('PLAYER:  Playback ... createPlayer() - ALREADY ! ')

      this.player.stop()
      return
    }

    try
    {
      this.player = new AAMPMediaPlayer()

      // console.log('PLAYER:  Playback ... createPlayer()  >>>  this.player: ' + this.player)

      if(this.player)
      {
        this.player.addEventListener('playbackStateChanged', this._playbackStateChanged.bind(this))

        this.player.addEventListener('playbackCompleted',      this._mediaEndReached)
        this.player.addEventListener('playbackSpeedChanged',   this._mediaSpeedChanged)
        this.player.addEventListener('bitrateChanged',         this._bitrateChanged)
        this.player.addEventListener('playbackFailed',         this._mediaPlaybackFailed.bind(this))
        this.player.addEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this))
        this.player.addEventListener('playbackStarted',        this._mediaPlaybackStarted.bind(this))
        this.player.addEventListener('durationChanged',        this._mediaDurationChanged)

        this.playerState = this.playerStatesEnum.idle
      }
      else
      {
        console.log('PLAYER:  Playback ... createPlayer() >>> FAILED !! ')
      }
    }
    catch (error)
    {
      console.error('PLAYER:  AAMPVideoPlayer (native)  is NOT defined')
    }
  }

  /**
   * Loads the player with video URL.
   * @param videoInfo the url and the info regarding the video like title.
   */
  load(videoInfo)
  {
    if(this.player)
    {
      this.createPlayer()

      console.log('PLAYER:  load()  url ' + videoInfo.url)

      this.videoInfo           = videoInfo
      this.configObj           = this.defaultInitConfig
      this.configObj.drmConfig = this.videoInfo.drmConfig
      this.configObj.offset    = this.videoInfo.startTime

      this.player.initConfig(this.configObj)
      this.player.load(videoInfo.url)

      this.play()
      this.tag('LoaderImg').alpha = 1
    }
    else
    {
      console.log('PLAYER:  Playback ... load() >>>  No Player  !!!!' )
    }
  }

  /**
   * Starts playback when enough data is buffered at play head.
   */
  play()
  {
    if(this.player)
    {
      this.player.play()
      this.playbackRateIndex = this.playbackSpeeds.indexOf(1)
    }
    else
    {
      console.log('PLAYER:  Playback ... play() >>>  No Player  !!!!' )
    }
  }

  /**
   * Pauses playback.
   */
  pause()
  {
    if(this.player)
    {
      this.player.pause()
    }
    else
    {
      console.log('PLAYER:  Playback ... pause() >>>  No Player  !!!!' )
    }
  }

  /**
   * Stop playback and free resources.
   */
  stop()
  {
    if(this.player)
    {
      // Fade out Audio
      //
      if(stopTimer == null)
      {
        clearInterval(startTimer);

        stopTimer = setInterval(() =>
        {

          if ((this.player.getVolume() - 20) > 0)
          {
            console.log('PLAYER:  Playback ... stop() >>>  fade OUT audio' )

            this.player.setVolume(this.player.getVolume() - 10)
          }
          else
          {
            this.player.setVolume(0)

            clearInterval(stopTimer)
            stopTimer = null

            console.log('PLAYER:  Playback ... stop() >>>  CALLED' )
            this.player.stop()
          }
        }, 150);
      }
    }
    else
    {
      console.log('PLAYER:  Playback ... stop() >>>  No Player  !!!!' )
    }
  }

  /**
   * Function to perform fast forward of the video content.
   */
  fastfwd() {}
  /**
   * Function to perform fast rewind of the video content.
   */
  fastrwd() {}

  /**
   * Function that returns player instance.
   * @returns player instance.
   */
  getPlayer()
  {
    return this.player || this
  }

  /**
   * Function to release the video player instance when not in use.
   */
  destroy()
  {
    if(this.player)
    {
      if (this.player.getCurrentState() !== this.playerStatesEnum.idle)
      {
        this.stop()
      }
      this.player.removeEventListener('playbackStateChanged',   this._playbackStateChanged)
      this.player.removeEventListener('playbackCompleted',      this._mediaEndReached)
      this.player.removeEventListener('playbackSpeedChanged',   this._mediaSpeedChanged)
      this.player.removeEventListener('bitrateChanged',         this._bitrateChanged)
      this.player.removeEventListener('playbackFailed',         this._mediaPlaybackFailed.bind(this))
      this.player.removeEventListener('playbackProgressUpdate', this._mediaProgressUpdate.bind(this))
      this.player.removeEventListener('playbackStarted',        this._mediaPlaybackStarted.bind(this))
      this.player.removeEventListener('durationChanged',        this._mediaDurationChanged)

      this.player.release()
      this.player = null
    }//PLAYER
  }
}
