![sVim](banner.png)

sVim is a Safari extension with shortcuts similar to Vim.
The functionality of sVim will mostly follow the Chrome extension [cVim](https://github.com/1995eaton/chromium-vim).

# Get it
- Download the [latest release](https://github.com/flipxfx/sVim/releases/latest)
- Releases and release notes are all uploaded to Github on the [releases page](https://github.com/flipxfx/sVim/releases)
- The extension will update via Safari Extension Updates

# Help

## Shortcuts

| Keyboard Command       | Description                                    | Mapping Name            |
| ---                    | ---                                            | ---                     |
| **Movement**           |                                                |                         |
| "j"                    | scroll down                                    | scrollDown              |
| "k"                    | scroll up                                      | scrollUp                |
| "h"                    | scroll left                                    | scrollLeft              |
| "l"                    | scroll right                                   | scrollRight             |
| "d"                    | scroll half-page down                          | scrollPageDown          |
| "e", "u"               | scroll half-page up                            | scrollPageUp            |
| "shift+d"              | scroll full-page down                          | scrollFullPageDown      |
| "shift+e"              | scroll full-page up                            | scrollFullPageUp        |
| "shift+g"              | scroll to bottom of the page                   | scrollToBottom          |
| "g g"                  | scroll to top of the page                      | scrollToTop             |
| "0"                    | scroll to the left of the page                 | scrollToLeft            |
| "$"                    | scroll to the right of the page                | scrollToRight           |
| "g i"                  | go to the first input box                      | goToInput               |
| **Miscellaneous**      |                                                |                         |
| "r"                    | reload the current tab                         | reloadTab               |
| "z i"                  | zoom page in                                   | zoomPageIn              |
| "z o"                  | zoom page out                                  | zoomPageOut             |
| "z 0"                  | zoom page to original size                     | zoomOrig                |
| "g r"                  | toggle Safari reader if possible               | toggleReader            |
| "g v"                  | show sVimrc page                               | showsVimrc              |
| "g ?"                  | open help page in new tab                      | help                    |
| **Tab Navigation**     |                                                |                         |
| "g t", "shift+k"       | navigate to the next tab                       | nextTab                 |
| "g shift+t", "shift+j" | navigate to the previous tab                   | previousTab             |
| "g 0"                  | go to the first tab                            | firstTab                |
| "g $"                  | go to the last tab                             | lastTab                 |
| "g l"                  | go to the last active tab that's still open    | lastActiveTab           |
| "x"                    | close the current tab                          | quit                    |
| "g x shift+t"          | close the tab to the left of the current tab   | closeTabLeft            |
| "g x t"                | close the tab to the right of the current tab  | closeTabRight           |
| "g x 0"                | close all tabs to the left of the current tab  | closeTabsToLeft         |
| "g x $"                | close all tabs to the right of the current tab | closeTabsToRight        |
| "shift+x"              | open the last closed tab                       | lastClosedTab           |
| "ctrl+shift+x"         | open the last closed tab in background         | lastClosedTabBackground |
| "t"                    | open new tab                                   | newTab                  |
| "shift+h"              | go back in history                             | goBack                  |
| "shift+l"              | go forward in history                          | goForward               |
| "shift+,"              | move current tab left                          | moveTabLeft             |
| "shift+."              | move current tab right                         | moveTabRight            |
| "g u"                  | navigate to parent directory                   | parentDirectory         |
| "g shift+u"            | navigate to top directory                      | topDirectory            |
| "g d"                  | navigate to parent domain                      | parentDomain            |
| "g h"                  | navigate to home page                          | homePage                |
| **Window Navigation**  |                                                |                         |
| "w"                    | open new window                                | newWindow               |
| "g w"                  | navigate to the next window                    | nextWindow              |
| "g shift+w"            | navigate to the previous window                | previousWindow          |
| **Modes**              |                                                |                         |
| "escape", "ctrl+\["    | enter normal mode                              | normalMode              |
| "i"                    | enter insert mode                              | insertMode              |
| **Link Hints**         |                                                |                         |
| "f"                    | open link in current tab                       | createHint              |
| "shift+f"              | open link in new background tab                | createTabbedHint        |
| **Search**         |                                                |                         |
| "o"                    | search in current tab                          | searchInTab             |
| "shift+t"              | search in new tab                              | searchInNewTab          |

## sVimrc
- The sVimrc page is where you can customize sVim settings and css.
- You can access the page by pressing `g v` or via the extension settings in Safari.
- The sVimrc and sVimcss files can be synced via [gist](https://gist.github.com).
  - The gist id is found at the end of the url when viewing the gist.
  - Note it does not matter the name of your gist or the file, sVim will just grab the first file from the gist id supplied. I use sVim.rc and sVim.css.
- For simplicity, strings in sVimrc should be wrapped in `"`.
- Save the sVimrc page with `command+s`.
- Goto or switch between sVimrc and sVimcss with `ctrl+w`.

### sVimrc Commands
- **set**
  - Used for boolean settings.
  - Prepend `no` to setting name to unset.
  - Set smooth scroll with `set smoothscroll` and unset with `set nosmoothscroll`.
- **let**
  - Used to set non-boolean settings.
  - These settings can be of type integer, string or array.
  - Set new tab url like `let newtaburl = "http://google.com"`.
  - Set scroll step like `let scrollstep = 100`.
  - Set black lists like `let blacklists = ["*://example.com/stuff/*", "*://mail.google.com/*"]`.
- **map**
  - Used to set/overwrite shortcuts.
  - sVim uses [Mousetrap](http://craig.is/killing/mice) for shortcuts and keyboard commands should follow it's format.
  - You can use leader with `<Leader>` in the keyboard command.
  - Set the down arrow key to scroll down with `map "down" scrollDown`.
  - Set the leader key + the J key to scroll down with `map "<Leader> j" scrollFullPageDown`.
- **unmap**
  - Used to remove a shortcut.
  - Remove `j` shortcut with `unmap "j"`.
- **unmapAll**
  - Used to remove all current shortcuts with `unmapAll`.
- **"**
  - Used to add comments to sVimrc.
  - Comment by adding `"` to the beginning of the line (inline not supported).
  - Add comment like `" This is a comment`.

### sVimrc Settings
| Setting Name          | Description                                                                                 | Type    | Default           |
| ---                   | ---                                                                                         | ---     | ---               |
| preventdefaultesc     | prevent escape from exiting full screen, if unset then only prevent when not in normal mode | boolean | true              |
| smoothscroll          | use smooth scrolling                                                                        | boolean | true              |
| fullpagescrollpercent | percent of the page to scroll by when using scrollFullPageUp and scrollFullPageDown         | integer | 85                |
| lastactivetablimit    | number of last active tabs to remember                                                      | integer | 25                |
| lastclosedtablimit    | number of closed tabs to remember                                                           | integer | 25                |
| scrollduration        | duration of smooth scrolling                                                                | integer | 30                |
| scrollstep            | amount of pixels scrolled when using scrollUp and scrollDown                                | integer | 60                |
| zoomstep              | percent to zoom when using zoomPageIn and zoomPageOut                                       | integer | 10                |
| hintcharacters        | characters to be used in link hint mode                                                     | string  | "asdfgqwertzxcvb" |
| homeurl               | url to use as home page                                                                     | string  | "topsites://"     |
| mapleader             | <Leader> key                                                                                | string  | "\"               |
| newtaburl             | url to use as the default new tab url                                                       | string  | "topsites://"     |
| blacklists            | disable sVim on the sites matching one of the patterns                                      | array   | []                |
| searchengine          | the search engine, choose in [google, duckduckgo, yahoo, bing, baidu, sogou]                | string   | "google"          |

### sVimrc Example
```viml
" Settings
set nosmoothscroll
let fullpagescrollpercent = 100
let lastactivetablimit = 50;
let lastclosedtablimit = 50;
let scrollduration = 25
let scrollstep = 65
let zoomstep = 15
let hintcharacters = "1234567890";
let homeurl = "http://google.com";
let mapleader = ","
let newtaburl = "http://google.com"
let blacklists = ["*://example.com/stuff/*", "*://mail.google.com/*"]

" Shortcuts
map "q" nextTab
map "shift+q" previousTab
map "<Leader> h" closeTabLeft
map "<Leader> l" closeTabRight
map "down" scrollDown
map "up" scrollUp
map "left" scrollLeft
map "right" scrollRight
map "space" scrollFullPageDown
```
