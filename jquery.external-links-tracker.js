/*
  jQuery External Links Tracker Plugin
  Copyright (C) 2011 Paradigm New Media Group
  http://pnmg.com | http://github.com/pnmg/jquery-external-links-tracker

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU General Public License
  as published by the Free Software Foundation; either version 2
  of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/
(function($){
  $(document).ready(function(){
    // detect if logging is enabled
    var has_logger = typeof console === 'object' && console.log;
    // detect if we can use the new jQuery.on() method
  	var useOn = typeof jQuery.fn.on != 'undefined';
    // get the hostname, ignoring subdomains and the domain extension
    var host = window.location.hostname
    host = host.split('.');
    if(host.length == 1){ 
      // localhost, others?
      host = host[0];
    }
    else if(host.length == 4 && window.location.hostname.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)){ 
      // handle IPs
      host = window.location.hostname;
    }
    else {
      // domain names
      if(host[0] == 'www'){
        host.shift(); // remove www
      }
      host = host.join('.');
    }
    var http = 'http://'+ host;
    var https = 'https://'+ host;
    
    // handle the link tracking
    var tracker = function(ev){
      if(has_logger){ console.log('tracker()'); }
      
      var internalHandler = function(ev){
        if($this.hasClass('newwindow')){
          ev.preventDefault();
          window.open(href);
        }
      }
      
      var $this = $(this);
      var href = $this.attr('href');
      if(/^[\.\/].+$/.test(href) && !/^\/\/.+/.test(href)){
        // internal
        if(has_logger){ console.log('internal'); }
        internalHandler(ev);
      }
      else {
        // potentially external
        if(href.substr(0, http.length) != http && href.substr(0, https.length) != https){
          if(has_logger){ console.log('external'); }
          ev.preventDefault();
          var linkLocation = href.replace(/^(http|https):\/\//, '').replace(/www\./i, '').replace(/\/\//g, '').replace(/\./gi, '_');
          var track = '/outgoing/'+ linkLocation;
          if(typeof(pageTracker) != 'undefined'){
            pageTracker._trackPageview(track);
            if(has_logger){ console.log('Tracked external link: '+ track) };
          } 
          else if(typeof(_gat) == 'object') {
            _gaq.push(['_trackPageview', track]);
            if(has_logger){ console.log('Tracked external link: '+ track) };
          } 
          else {
            if(has_logger){ console.log('Could not track external link: '+ track) }
          }
          window.open(href);
        }
        else {
          if(has_logger){ console.log('internal 2'); }
          internalHandler(ev);
        }
      }
      
    };
    
    // track links
    var useOn = false;
  	if(useOn){
      // jQuery 1.7+
      if(has_logger){ console.log('using .on()'); }
      $('a[href]').on('click', tracker);
  	}
    else {
      // jQuery < 1.7
      if(has_logger){ console.log('using .delegate()'); }
      $('body').delegate('a[href]', 'click', tracker);
    }
  });
})(jQuery);