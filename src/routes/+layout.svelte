<script>
    import "../global.css";
    import "../i18n";
    import { isLoading } from "svelte-i18n";
    import { _, locale, getLocaleFromNavigator } from "svelte-i18n";
    import "../app.css";
    import "../ext/github-ribbon.css";
   
    //renamed file https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3294867
    let language=initLanguage();

    function initLanguage() {
        let language;
        if (getLocaleFromNavigator()=="fr") {
            locale.set("fr")
            language="Language: English";
        } else {
            locale.set("en")
            language="Langue: Français";
        }
        return language;
    };

    function updateLanguage(){
        if ( language == "Language: English") {
            locale.set("en")
            language="Langue: Français";
        } else {
            locale.set("fr")
            language="Language: English";
        }
        showMenu()
    };

    function showMenu() {
        var menu = document.getElementById("burger_menu");
        var icon = document.getElementById("burger_icon");
        var content = document.getElementById("content");
        var navbar = document.getElementById("navbar");
        if ( !(menu.style.display === "block")) {
            //menu.className = "open";
            menu.style.display = "block";
            icon.childNodes[0].style.background = "#FFF"
            icon.childNodes[2].style.background = "#FFF"
            icon.childNodes[4].style.background = "#FFF"
        } else {
            //menu.classList.remove = "open";
            menu.style.display = "none";                  
            icon.childNodes[0].style.background = "#008A8C"
            icon.childNodes[2].style.background = "#008A8C"
            icon.childNodes[4].style.background = "#008A8C"
        }
    }
</script>

<div id="navbar" class="flex">
    <div class="flex title-font font-medium items-center">
        <a href="https://boavizta.org"><img id="logo" style="height: 47px;width: 32px;" src="./boavizta-logo-4.png" alt="Boavizta"></a>
        <h1 class="title-main">Datavizta</h1>
    </div>
    <a id="burger_icon" href="javascript:void(0);" class="ml-auto" on:click={showMenu}>
        <!-- Some spans to act as a hamburger -->
        <span></span>
        <span></span>
        <span></span>
      </a>
    
      <!-- burger Menu -->
      <nav id="burger_menu">
        <ul>
          <li><a class="mr-5" href="/" on:click={showMenu}>{$_('nav.manufacturer')}</a></li>
          <li><a class="mr-5" href="/serversimpact" on:click={showMenu}>{$_('nav.server-impact')}</a></li>
          <li><a class="mr-5" href="javascript:void(0);"    title="Choose language" on:click={updateLanguage}>{language}</a></li>
        </ul>
      </nav>
    
</div>

{#if !$isLoading}
    <slot />
{/if}

<style>


    /* show responsive menu and position at the right of the screen */
    #burger_menu {
      display: none;
      position: absolute;
      margin: 0;
      right: 0;
      top: 0;
      min-width: 50vw;
      max-width: 60vw;
      height: 100vh;
  
      z-index: 99;
     /* transform-origin: 0% 0%;
      transform: translate(200%, 0);
  
      transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1);*/
    }
  
    #burger_menu ul {
      display: flex;
      flex-direction: column;
  
      position: absolute;
      margin: 0;
      right: 0;
      top: 0;
      margin-top: 0;
      min-width: 50vw;
      max-width: 60vw;
      height: 100vh;
      padding: 82px 0 0;
  
      text-align: center;
  
      background: #008A8C;
      list-style-type: none;
      -webkit-font-smoothing: antialiased;
    }
  
    #burger_menu li {
      padding: 12px 24px;
      color:#FFF;
      font-size: x-large;
      font-weight: 700;
      list-style: none
    }
  
    #burger_menu a {
      white-space: nowrap;
      color: #FFF;
      text-decoration: none;
    }
  
    /* ******************** HAMBURGER ICON ******************** */
    /* define size and position of the hamburger link */
    #burger_icon {
      display: block;
      position: relative;
      margin-right: -5px;
      margin-left: auto;
      width: 33px;
      height: 28px;
  
      z-index: 100;
  
      -webkit-user-select: none;
      user-select: none;
      cursor: pointer;
    }
  
    /* define the style (size, color, position, animation, ...) of the 3 spans */
    #burger_icon span {
      display: block;
      position: absolute;
      height: 4px;
      width: 100%;
      margin-bottom: 5px;
  
      background: #008A8C;
      border-radius: 3px;
  
      z-index: 100;
  
      opacity: 1;
      left: 0;
  
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
      -webkit-transition: 0.25s ease-in-out;
      -moz-transition: 0.25s ease-in-out;
      -o-transition: 0.25s ease-in-out;
      transition: 0.25s ease-in-out;
    }
  
    /* set the 3 spans position to look like a hamburger */
    #burger_icon span:nth-child(1) {
      top: 0px;
      -webkit-transform-origin: left top;
      -moz-transform-origin: left top;
      -o-transform-origin: left top;
      transform-origin: left top;
    }
    #burger_icon span:nth-child(2) {
      top: 12px;
      -webkit-transform-origin: left center;
      -moz-transform-origin: left center;
      -o-transform-origin: left center;
      transform-origin: left center;
    }
    #burger_icon span:nth-child(3) {
      top: 24px;
      -webkit-transform-origin: left bottom;
      -moz-transform-origin: left bottom;
      -o-transform-origin: left bottom;
      transform-origin: left bottom;
    }
  
    /* the first span rotates 45° \ */
    #burger_icon.open span:nth-child(1) {
      width: 110%;
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      transform: rotate(45deg);
    }
  
    /* the second span disappears */
    #burger_icon.open span:nth-child(2) {
      width: 0%;
      opacity: 0;
    }
  
    /* the last span rotates -45° / */
    #burger_icon.open span:nth-child(3) {
      width: 110%;
      -webkit-transform: rotate(-45deg);
      -moz-transform: rotate(-45deg);
      -o-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }
  
  </style>

