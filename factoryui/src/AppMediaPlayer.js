/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Utils } from 'wpe-lightning-sdk'

// import { KEYS, SCREEN } from './components/Globals';

import AAMPVideoPlayer2 from './components/player/AAMPVideoPlayer2'

let tmpCLR = 0xFFff00ff //   #ff00FF

export default class AppMediaPlayer extends lng.Component
{
    static _template( )
    {
      return  {
        w: 800,
        h: 400,
        color: tmpCLR,
        rect: true,

        Player: {
          visible: true,
          type: AAMPVideoPlayer2,
        }
      }
    };

    _init()
    {
      this.player = this.tag('Player')
    }

    _getFocused()
    {
      return this;
    }


  $mediaPlackbackEnded()
  {
    console.log('PLAYER:  Finished  >> FIRED >> $mediaPlackbackEnded ')
    console.log('PLAYER:  Finished  >> FIRED >> $mediaPlackbackEnded ')

    console.log('########  FIRE >>>  closeMediaPlayer')
    console.log('########  FIRE >>>  closeMediaPlayer')
    console.log('########  FIRE >>>  closeMediaPlayer')
    console.log('########  FIRE >>>  closeMediaPlayer')

    this.fireAncestors('$closeMediaPlayer');
  }

  playVideo(content)
  {
    console.log("APP >>   playVideo() ... ENTER");

    try
    {
      this.player.load({
            title: content.title,
         subtitle: content.clipTitle,
            image: content.imageSrc,
              url: content.video,
        drmConfig: null,
        startTime: content.startTime,
          endTime: content.endTime,
          content: content
      })

      this._setState('MediaPlayerState')
    }
    catch (error)
    {
      console.log('Playback Failed ' + error)
    }
  }

  playVideoHD()
  {
    let content =
    {
      title: "Test B Title",
      clipTitle: "Test B Clip Title",
      imageSrc: null,
      video: Utils.asset('videos/VIDEO_TEST.mp4'),
      // video: 'http://localhost:50050/VIDEO_TEST.mp4',
      drmConfig: null,
      startTime: 0,
      endTime: 12.5
    }

    this.playVideo(content)
  }

  playVideo4K()
  {
    let content =
    {
      title: "Test B Title",
      clipTitle: "Test B Clip Title",
      imageSrc: null,
      video: Utils.asset('videos/Tv - 31851.mp4'),
      // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      // video: 'https://vod-progressive.akamaized.net/exp=1604078994~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F2801%2F15%2F389009390%2F1642599867.mp4~hmac=1ecfde22e3d47f2381c4a4873c356d02af6f320949e62ac3f0ca27346d585331/vimeo-prod-skyfire-std-us/01/2801/15/389009390/1642599867.mp4',
      drmConfig: null,
      startTime: 0,
      endTime: 12.5
    }

    this.playVideo(content)
  }

    static _states()
    {
      return [
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class PlayVideoA_State extends this  // AAMPVideoPlayer2
        {
          $enter()
          {
            console.log('PlayVideoA_State - ENTER ')

            // Licenses:  https://pixabay.com/service/license/
            //
            // What is allowed?
            //
            // ✓	All content on Pixabay can be used for free for commercial and non-commercial
            //    use across print and digital, except in the cases mentioned in "What is not allowed".
            //
            // ✓	Attribution is not required. Giving credit to the contributor or Pixabay
            //    is not necessary but is always appreciated by our community.
            //
            // ✓	You can make modifications to content from Pixabay.
            //
            // Free from  https://pixabay.com/videos/tv-test-pattern-color-television-31851/
            //            https://pixabay.com/videos/lights-rays-colorful-color-13306/
            //
            let content =
            {
              title: "Test A Title",
              clipTitle: "Test A Clip Title",
              imageSrc: null,
              video: Utils.asset('videos/VIDEO_TEST.mp4'),
              // video: Utils.asset('videos/Lights - 13306.mp4'),
              // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              // video: 'https://vod-progressive.akamaized.net/exp=1604079249~acl=%2A%2F892312262.mp4%2A~hmac=3e6f432a54d1fd2a273fe167a61bea0b8170fbb2ce214850085306cd44c64912/vimeo-prod-skyfire-std-us/01/4381/9/246909929/892312262.mp4',
              // video: 'https://vod-progressive.akamaized.net/exp=1604079361~acl=%2A%2F448954956.mp4%2A~hmac=c403fc73fb9a58ce3a8619383c231e6a83c863b664d8cff1b8d5c8af66b00454/vimeo-prod-skyfire-std-us/01/4565/5/147827978/448954956.mp4', //https://pixabay.com/videos/bokeh-blur-fire-circle-1500/
              drmConfig: null,
              startTime: 0,
              endTime: 18
            }

            this.playVideo(content)
          }
        }, // CLASS - PlayVideoA_State
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class PlayVideoB_State extends this
        {
          $enter()
          {
            console.log('PlayVideoB_State - ENTER ')

            let content =
            {
              title: "Test B Title",
              clipTitle: "Test B Clip Title",
              imageSrc: null,
              // video: Utils.asset('videos/Tv - 31851.mp4'),
              video: 'http://localhost:50050/VIDEO_TEST.mp4',
              drmConfig: null,
              startTime: 0,
              endTime: 12.5
            }

            this.playVideo(content)
          }
        }, // CLASS - PlayVideoB_State
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        class MediaPlayerState extends this
        {
          $enter(event)
          {
            // console.log(">>>>>>>>>>>>   STATE:  MediaPlayerState - ENTER ... this.player: " + this.player);

            if(this.player)
            {
             this.player.setSmooth('alpha',  1.0, {duration: 0.4 });
            // this.mainGui.setSmooth('alpha', 0.0, {duration: 0.2 });
            }
          }

          $exit()
          {
            // console.log(">>>>>>>>>>>>   STATE:  MediaPlayerState - EXIT");

            if(this.player)
            {
              this.player.stop()

             this.player.setSmooth('alpha',  0.0, {duration: 0.2 });
            // this.mainGui.setSmooth('alpha', 1.0, {duration: 0.4 });
            }
          }

          _getFocused()
          {
            return this.player
          }

          _handleKey(k)
          {
            switch(k.keyCode )
            {
              default:
                console.log('MediaPlayerState >>> _handleKey() - default: ' +k.keyCode )
                return false
            }//SWITCH

            return true
          }
        }// CLASS - MediaPlayerState
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      ]
     }//_states
  }//CLASS
