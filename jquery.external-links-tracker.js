/*
  jQuery External Links Tracker Plugin
  Copyright (C) 2010 Paradigm New Media Group
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
    // get the hostname, ignoring subdomains and the domain extension
    var host = window.location.hostname
    host = host.split('.')
    if(host.length == 1){ 
      // localhost
      host = host[0] 
    }
    else if(host.length == 4 && window.location.hostname.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)){ 
      // handle IPs
      host = window.location.hostname 
    }
    else {
      // domain names
      host = host[host.length - 2] + '.' + host[host.length - 1] 
    }
    // track external links
    $("a[href^='http']:not([href*='" + host + "'])").live('click', function(e){
      e.preventDefault();
      var linkLocation = this.href.replace(/^(http|https):\/\//, '').replace(/www\./i, '').replace(/\./gi, '_');
      var track = '/outgoing/'+ linkLocation
      if(typeof(pageTracker) != 'undefined'){
        pageTracker._trackPageview(track);
      }
      else {
        if(window.console){ window.console.log('Could not track external link: '+ track) }
      }
      window.open($(this).attr('href'));
    });
  });
})(jQuery);