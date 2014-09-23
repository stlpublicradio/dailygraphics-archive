/* soundcite - v0.3.0 - 2014-06-16
 * Copyright (c) 2014 Tyler J. Fisher and Northwestern University Knight Lab 
 */
// window.Popcorn.version = 1.5.6
// http://popcornjs.org/code/dist/popcorn-complete.min.js
// window.SC._version = 2.0.0
// http://connect.soundcloud.com/sdk-2.0.0.js
//
(function(window, document, version, callback) { // http://stackoverflow.com/questions/2170439/how-to-embed-javascript-widget-that-depends-on-jquery-into-an-unknown-environmen
    var loaded_j = false;
    var loaded_p = false;   
    var loaded_s = false;
    
    // document.head not standard before HTML5
    var insertionPoint = document.head || document.getElementsByTagName('head').item(0) || document.documentElement.childNodes[0];
    
    function load_jquery(version, cb) {
        var js, d;       
        if (!(js = window.jQuery) || version > js.fn.jquery || cb(js)) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://code.jquery.com/jquery-1.9.1.min.js";       
            script.onload = script.onreadystatechange = function() {
                if(!loaded_j && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                    js = window.jQuery.noConflict(1);
                    cb(js, loaded_j = true);
                    js(script).remove();               
                }
            };       
            insertionPoint.appendChild(script);
        } 
    }
        
    function load_popcorn(j, version, cb) {
        var js, d, new_js;      
        if(!(js = window.Popcorn) || version > js.version || cb(js)) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://popcornjs.org/code/dist/popcorn-complete.min.js";
            script.onload = script.onreadystatechange = function() {
                if(!loaded_p && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                    new_js = window.Popcorn;
                    if(js) {
                        window.Popcorn = js;
                    }
                    cb(new_js, loaded_p = true);
                    j(script).remove();               
                }
            };       
            insertionPoint.appendChild(script);
        } 
    }
    
    // Loading player api initializes incomplete version of window.SC
    function load_soundcloud(j, version, cb) {
        var js, d;

        if(!(js = window.SC) || !js.Dialog || version > js._version || cb(js)) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "http://connect.soundcloud.com/sdk-2.0.0.js";
            script.onload = script.onreadystatechange = function() {
                if(!loaded_s && (!(d = this.readyState) || d == "loaded" || d == "complete")) {
                    cb(window.SC, loaded_s = true);
                    j(script).remove();
                }
            };
            insertionPoint.appendChild(script);        
        }    
    }
    
    load_jquery(version, function(j) {
        load_popcorn(j, "1.5.6", function(p) {
            load_soundcloud(j, "2.0.0", function(s) {
               callback(j, p, s);   
            });                
        });
    });
     
})(window, document, "1.3", function($, $Popcorn, $SoundCloud) {    
    $(document).ready(function () {
        var SOUNDCITE_CONFIG = {
            update_playing_element: function(el, percentage) {
                	$(el).css({
                    'background' : '-webkit-linear-gradient(left, rgba(204,32,59,.3)' + percentage + '%, rgba(204,32,59,.1)' + (percentage + 1) + '%)',
                    'background' : 'linear-gradient(to right, rgba(204,32,59,.3)' + percentage + '%, rgba(204,32,59,.1)' + (percentage + 1) + '%)'
                	});
            }
        }
        $.extend(SOUNDCITE_CONFIG, window.SOUNDCITE_CONFIG)
        // global vars
        window.soundcite = {};

        // check for mobile        
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            soundcite.mobile = true;
        } else {
            soundcite.mobile = false;
        }
    
        var clips = [];
        var $audio = $('<div class="soundcite-audio"></div>');
        
        $('body').append($audio);

        // initialize SoundCloud SDK
        $SoundCloud.initialize({
            client_id: "5ba7fd66044a60db41a97cb9d924996a",
        });

        // borrowing underscore.js bind function
        var bind = function(func, context) {
            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 2);
            return function() {
              return func.apply(context, args.concat(slice.call(arguments)));
            };
        };

// Clip
        function Clip(el) {
            this.el = el;
            this.$el = $(this.el);
            this.start = el.attributes['data-start'].value || 0;        // ms
            this.end = el.attributes['data-end'].value;                 // ms
            this.playing = false;
            this.sound = null;                          // implement in subclass
            
            clips.push(this);   // keep track of this
        }
        
        Clip.prototype.sound_loaded = function() {
            this.$el.click(bind(this.click_handler, this));           
            this.$el.addClass('soundcite-loaded soundcite-play');        
        }
        
        Clip.prototype.pause = function() {
            this.$el.removeClass('soundcite-pause');
            this.$el.addClass('soundcite-play');
            this.pause_sound();                         // implement in subclass
            this.playing = false;
        }
        
        Clip.prototype.stop = function() {    
            this.$el.removeClass('soundcite-pause');
            this.$el.addClass('soundcite-play');            
            this.stop_sound();                          // implement in subclass
            this.playing = false;
        }

        Clip.prototype.track_progress = function() {
            var totalTime = this.end - this.start;
            var position = this.sound_position();       // implement in subclass
            var relative_position = position - this.start;
            var percentage = (relative_position * 100) / totalTime;            
            SOUNDCITE_CONFIG.update_playing_element(this.el, percentage);
        }

        Clip.prototype.click_handler = function() {
             for(var i = 0; i < clips.length; i++) {
                if(this.el !== clips[i].el && clips[i].playing) {
                    clips[i].pause();
                }
            }
             
            if(this.playing) {
                this.pause();
            } else {
                this.play();                            // implement in subclass
            }
        }

        function SoundCloudClip(el) {
            Clip.apply(this, Array.prototype.slice.call(arguments));

            this.id = el.attributes['data-id'].value;

            $SoundCloud.stream(this.id, bind(function(sound) {
                this.sound = sound;

                this.sound._player.on("positionChange", bind(function(pos) {
                    this.track_progress();
                    
                    if(pos > this.end) {
                        this.stop();
                    }
                }, this));
               
               this.sound_loaded();
            }, this));
        }
        SoundCloudClip.prototype = Object.create(Clip.prototype);

        SoundCloudClip.prototype.sound_position = function() {
            return this.sound.getCurrentPosition();
        }
                        
        SoundCloudClip.prototype.pause_sound = function() { 
            this.sound.pause();
        }
        
        SoundCloudClip.prototype.stop_sound = function() {
            this.sound.stop();
        }

        SoundCloudClip.prototype.play = function() {
            var pos = this.sound_position();

            if(pos < this.start || pos >= this.end) {
                this.sound.seek(this.start);
            }
            
            this.$el.removeClass('soundcite-play');
            this.$el.addClass('soundcite-pause');

            this.sound.play();                        
            this.playing = true;
        }
                
// Popcorn Clip    
        function PopcornClip(el) {
            Clip.apply(this, Array.prototype.slice.call(arguments));
 
            this.id = 'soundcite-audio-'+clips.length;
            this.url = el.attributes['data-url'].value;
           
            // convert to ms to secs
            this.start = Math.floor(this.start / 1000);
            this.end = Math.floor(this.end / 1000);
                              
            $audio.append('<audio id="'+this.id+'" src="'+this.url+'" preload="true"></audio>');   
            this.sound = $Popcorn('#'+this.id, {'frameAnimation': true});
                        
            // Safari iOS Audio streams cannot be loaded unless triggered by a 
            // user event, so load in play_sound via click for mobile
            this.sound.on('loadeddata', bind(function() {
                if(!this.end) {
                    this.end = this.sound.duration();
                }                  
                this.sound.cue(this.end, bind(this.stop, this)); 
                
                if(!soundcite.mobile) {
                    this.sound_loaded();
                }
            }, this));

            if(soundcite.mobile) {   
                this.sound_loaded();
            } else if(this.sound.readyState() > 1) {
                this.sound_loaded();
            }
        } 
        PopcornClip.prototype = Object.create(Clip.prototype);
     
        PopcornClip.prototype.sound_position = function() {
            return this.sound.currentTime();
        }

        PopcornClip.prototype.pause_sound = function() {
            this.sound.pause();      
            this.sound.off('timeupdate');
        }
        
        PopcornClip.prototype.stop_sound = function() {
            this.sound.pause();
            this.sound.off('timeupdate');
        }

        PopcornClip.prototype._play_sound = function() {
            this.$el.removeClass('soundcite-loading soundcite-play');
            this.$el.addClass('soundcite-pause');
            this.sound.play();
            this.playing = true;
 
            this.sound.on('timeupdate', bind(this.track_progress, this));
            this.sound.on('ended', bind(this.stop, this));
        }
        
        PopcornClip.prototype.play_sound = function() {
            var pos = this.sound.roundTime();
            
            if(pos < this.start || pos >= this.end) {
                this.sound.on('seeked', bind(function() {
                    this.sound.off('seeked');
                    this._play_sound();                
                }, this));
                
                this.sound.currentTime(this.start);
            } else {
                this._play_sound();                         
            }
        }
              
        PopcornClip.prototype.play = function() {           
            if(soundcite.mobile) { 
                this.$el.removeClass('soundcite-play');
                this.$el.addClass('soundcite-loading');
                     
                if(this.sound.readyState() > 1) {
                    this.play_sound();
                } else {               
                    this.sound.on('canplaythrough',bind(function() {
                        this.play_sound();
                    }, this));
                    
                    $('#'+this.id)[0].load();   
                }  
            } else {
                this.play_sound();
            }       
        }
        

// set up clips array
        var soundcite_array = $('.soundcite');
        
        for(var i = 0; i < soundcite_array.length; i++) {
            var el = soundcite_array[i];          
            if(el.hasAttribute('data-url')) {
                new PopcornClip(el);
            } else { //if(!soundcite.mobile) {
                new SoundCloudClip(el);
            } 
        }
        
        soundcite.Clip = Clip;
        soundcite.SoundCloudClip = SoundCloudClip;
        soundcite.PopcornClip = PopcornClip;
        soundcite.clips = clips;    // keep track of clips
    });  
});
