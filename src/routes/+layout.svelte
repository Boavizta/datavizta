<script>
  import "../global.css";
  import "../i18n";
  import { isLoading } from "svelte-i18n";
  import { _, locale, getLocaleFromNavigator } from "svelte-i18n";
  import "../app.css";
  import "../ext/github-ribbon.css";
  export const prerender = true;
 
  //renamed file https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3294867
  let language=initLanguage("std");
  let language_min=initLanguage("min");
  function initLanguage(type) {
      let language;
      let language_min;
      if (getLocaleFromNavigator()=="fr") {
          locale.set("fr")
          language="Language: English";
          language_min="EN";
      } else {
          locale.set("en")
          language="Langue: Français";
          language_min="FR"
      }
      if (type == "min") {
        console.log(language_min)
        return language_min;
      } else { 
        console.log(language)
        return language;
      }
  };
  function updateLanguage(){
      if ( language == "Language: English") {
          locale.set("en")
          language="Langue: Français";
          language_min="FR";
      } else {
          locale.set("fr")
          language="Language: English";
          language_min="EN";
      }
  };
  function showMenu() {
      var menu = document.getElementById("burger_menu");
      var icon = document.getElementById("burger_icon");
      console.log("ShowMenu")
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
    <nav id="std_menu">
      <a class="mr-5" href="/">{$_('nav.home')}</a>
      <a class="mr-5" href="/manufacturerdata">{$_('nav.manufacturer')}</a>
      <a class="mr-5" href="/serversimpact">{$_('nav.server-impact')}</a>
    </nav>
    <nav id="burger_menu">
      <ul>
        <li><a class="mr-5" href="/" on:click={showMenu}>{$_('nav.home')}</a></li>
        <li><a class="mr-5" href="/manufacturerdata" on:click={showMenu}>{$_('nav.manufacturer')}</a></li>
        <li><a class="mr-5" href="/serversimpact" on:click={showMenu}>{$_('nav.server-impact')}</a></li>
        <li><a class="mr-5" href="javascript:void(0);"    title="Choose language" on:click={updateLanguage} on:click={showMenu}>{language}</a></li>
      </ul>
    </nav>
    <input id="switch-language-button" class="mb-5 ml-auto cursor-pointer" title="Choose language" on:click={updateLanguage} value={language_min} style="width: 20px;"/>
  
</div>
{#if !$isLoading}
  <slot />
{/if}
<style>
 #switch-language-button {
  margin-top: 15px;
  font-weight: 600;
  color: #008a8c;
 }
 #std_menu {
    color: #008a8c;
    /* position: relative; */
    letter-spacing: 1px;
    font-weight: 500;
    margin-left: 40px;
    margin-top: 8px;
 }

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
  }
  #burger_icon {
    display: none;
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
@media only screen and (max-width: 768px) {
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
  }
  #switch-language-button {
    display:none;
  }
  #std_menu {
    display:none;
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
}

</style>
