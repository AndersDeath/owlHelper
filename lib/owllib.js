/* Owl Lib v0.0.3 alpha | VNBStudio.ru */

(function(window) {
  'use strict';
  var devMode = false;

  //Точка входа и инициализации всей библиотеки

  function OwlLib() {}
  OwlLib.prototype.service = function(config) {
    if (config.devMode === true) {
      devMode = true;
    }
  };
  OwlLib.prototype.slider = function(config) {
    new OwlLibSlider(config);
  };
  OwlLib.prototype.tabs = function(config) {
    new OwlLibTabs(config);
  };

  //Начало логики Owl Lib Slider
  function OwlLibSlider(config) {
    this.tools = new OwlLibTools();
    this.purity = false;
    this.intervalId = false;
    this.slide = true;
    this.controls = false;
    this.speed = 3000;
    this.animate = {};
    this.dots = false;
    this.configCheck(config);
    if (!this.purity) {
      this.init();
    } else {
      this.tools.consoleLog('fatal error: OLS not init');
    }
  }
  // Метод проверки конфига на валидность
  OwlLibSlider.prototype.configCheck = function(config) {
    if (config === undefined) {
      console.log('Fatal Error, config not init');
      this.purity = true;
      return;
    }
    if (config.container !== undefined) {
      this.container = $(config.container);
    } else {
      this.tools.consoleLog('"Container" not init');
      this.purity = true;
    }
    if (config.slide !== undefined && config.slide === false) {
      this.slide = false;
    }
    if (config.controls !== undefined) {
      this.nextBtn = config.controls.next !== undefined ? $(config.controls.next) : null;
      this.prevBtn = config.controls.prev !== undefined ? $(config.controls.prev) : null;
      this.startBtn = config.controls.start !== undefined ? $(config.controls.start) : null;
      this.stopBtn = config.controls.stop !== undefined ? $(config.controls.stop) : null;
      this.controls = true;
    }

    if (config.dots === true) {
      this.dots = true;
    }
    if (config.speed !== undefined) {
      this.speed = parseInt(config.speed);
      if (isNaN(this.speed)) {
        this.tools.consoleLog('"Speed" not valid');
        this.purity = true;
      }
    }
    if (config.animate !== undefined) {
      if (config.animate.type !== undefined) {
        if (config.animate.type == 'fade') {
          this.animate.type = config.animate.type;
        } else {
          this.tools.consoleLog('"Animate type" not valid');
          this.purity = true;
        }
      } else {
        this.tools.consoleLog('"Animate type" not exist');
        this.purity = true;
      }
      if (config.animate.speed !== undefined) {
        this.animate.speed = parseInt(config.animate.speed);
        if (isNaN(this.animate.speed)) {
          this.tools.consoleLog('"Animate speed" not valid');
          this.purity = true;
        }
      } else {
        this.animate.speed = 300;
      }
    } else {
      this.animate = {};
    }
    if (config.itemEl !== undefined) {
      this.itemEl = $(config.itemEl, this.container);
    } else {
      this.itemEl = $('a', this.container);
    }

    if (this.purity === false) {
      if (this.container.length != 1) {
        this.tools.consoleLog('Container  not found in DOM or count elements > 1');
        this.purity = true;
      } else if (this.itemEl.length === 0) {
        this.tools.consoleLog('Items not found in DOM');
        this.purity = true;
      }
    }
    this.crop = config.crop;

  };

  OwlLibSlider.prototype.init = function() {
    this.show = 0;
    this.el = this.itemEl;
    this.elCol = this.el.length;
    if (this.crop !== undefined && !isNaN(parseInt(this.crop))) {
      var self = this;
      $.each(self.el, function(key, value) {
        self.el.eq(key).text(self.tools.cropStr($(value).text(), self.crop));
      });
    }
    if (this.controls !== false) {
      this.bind();
    }
    if (this.dots === true) {
      this.buildDots();
    }
    if (this.slide === true) {
      this.engineStart();
    } else {
      this.el.hide();
      this.el.eq(this.show).show();
    }
  };

  OwlLibSlider.prototype.bind = function() {
    var self = this;
    $(self.nextBtn).click(function() {
      if (self.slide === true) {
        self.engineStop();
        self.engineStart();
      }
      self.next();

    });
    $(self.prevBtn).click(function() {
      if (self.slide === true) {
        self.engineStop();
        self.engineStart();
      }
      self.prev();

    });
    if (self.startBtn !== null && self.startBtn.length == 1) {
      $(self.startBtn).click(function() {
        self.engineStop();
        self.engineStart();
        self.slide = true;

      });
    }
    if (self.stopBtn !== null && self.stopBtn.length == 1) {
      $(self.stopBtn).click(function() {
        self.engineStop();
        self.slide = false;
      });
    }
  };

  OwlLibSlider.prototype.goTo = function(num) {
    this.show = num;
    this.reDraw('hide');
    this.reDraw('show');
    if (self.slide === true) {
      this.engineStop();
      this.engineStart();
    }
  };

  OwlLibSlider.prototype.buildDots = function() {
    var self = this;
    var dotsContainer = $('<div/>', {
      'class': 'ols-dots',
    });
    $.each(this.el, function(key, value) {
      $(value).attr('data-ols-num', key);
      var span = $('<span/>', {
        'data-ols-dotnum': key,
        'click': function() {
          self.goTo(key);
        },
      });
      if (key === 0) {
        span.addClass('active');
      }
      dotsContainer.append(span);
    });
    $(this.container).append(dotsContainer);
  };

  OwlLibSlider.prototype.reDrawDots = function() {
    var self = this;
    $('.ols-dots>span').removeClass('active');
    $.each($('.ols-dots>span'), function(key, value) {
      if ($(value).attr('data-ols-dotnum') == self.show) {
        $(value).addClass('active');
      }
    });
  };

  OwlLibSlider.prototype.next = function() {

    if (this.show == (this.elCol - 1)) {
      this.show = 0;
    } else {
      this.show++;
    }
    this.reDraw('hide');
    this.reDraw('show');
  };

  OwlLibSlider.prototype.prev = function() {
    if (this.show === 0) {
      this.show = this.elCol - 1;
    } else {
      this.show--;
    }
    this.reDraw('hide');
    this.reDraw('show');
  };

  OwlLibSlider.prototype.reDraw = function(type) {
    if (Object.keys(this.animate).length === 0) {
      if (type == 'hide') {
        this.el.hide();
      }
      if (type == 'show') {
        this.el.eq(this.show).show();
        if (this.dots === true) {
          this.reDrawDots();
        }
      }
    } else if (this.animate.type == 'fade') {

      if (type == 'hide') {
        this.el.css('opacity', 0).hide();
      }
      if (type == 'show') {
        this.el.eq(this.show).show().animate({
          'opacity': 1
        }, this.animate.speed);
        if (this.dots === true) {
          this.reDrawDots();
        }
      }
    }
  };

  OwlLibSlider.prototype.engineStart = function() {
    var self = this;
    this.reDraw('hide');
    this.intervalId = setInterval(function() {
      self.next();
    }, this.speed);
    this.reDraw('show');
  };

  OwlLibSlider.prototype.engineStop = function() {
    clearInterval(this.intervalId);
  };
  //Конец логики для слайдера

  //Начало логики для табов
  function OwlLibTabs(config) {
    this.tools = new OwlLibTools();
    this.elements = {
      'btns': {
        'class': null,
        'el': 'div',
      },
      'areas': {
        'class': null,
        'el': 'div'
      }
    };
    this.start = 1;
    this.purity = false;
    this.configCheck(config);
    this.init();
  }

  OwlLibTabs.prototype.configCheck = function(config) {
    if (this.tools.ct(config, 'undefined')) {
      console.log('Fatal Error, config not init');
      this.purity = true;
      return;
    }
    if (!this.tools.ct(config.container, 'undefined')) {
      this.container = config.container;
    } else {
      this.tools.consoleLog('"Container" not init');
      this.purity = true;
    }

    if (!this.tools.ct(config.elements, 'undefined')) {
      if (!this.tools.ct(config.elements.btns, 'undefined')) {
        if (this.tools.ct(config.elements.btns, 'string')) {
          this.elements.btns.class = config.elements.btns;
        } else if (this.tools.ct(config.elements.btns, 'object')) {
          this.elements.btns.class = config.elements.btns[0];
          this.elements.btns.el = config.elements.btns[1];
        }
      } else {
        this.tools.consoleLog('"Elements btns" not init');
        this.purity = true;
      }
      if (!this.tools.ct(config.elements.areas, 'undefined')) {
        if (this.tools.ct(config.elements.areas, 'string')) {
          this.elements.areas.class = config.elements.areas;
        } else if (this.tools.ct(config.elements.btns, 'object')) {
          this.elements.areas.class = config.elements.areas[0];
          this.elements.areas.el = config.elements.areas[1];
        }
      } else {
        this.tools.consoleLog('"Elements areas" not init');
        this.purity = true;
      }

    } else {
      this.tools.consoleLog('"Elements" not init');
      this.purity = true;
    }
    if (!this.tools.ct(config.start, 'undefined')) {
      this.start = parseInt(config.start);
    } else {
      this.tools.consoleLog('"Elements" not init');
      this.purity = true;
    }
  };

  OwlLibTabs.prototype.init = function() {
    var controls = $(this.elements.btns.class + ' ' + this.elements.btns.el, this.container);
    var areas = $(this.elements.areas.class + ' ' + this.elements.areas.el, this.container);
    areas.hide();
    areas.eq(this.start - 1).show();
    controls.eq(this.start - 1).addClass('active');
    $.each(controls, function(key, value) {
      $(value).click(function() {
        areas.hide();
        areas.eq(key).show();
        controls.removeClass('active');
        $(this).addClass('active');
      });
    });
  };
  //Конец логики для табов

  //Начало логики для OwlLibTools - общих методов для работы библиотеки, методов которые могут использоваться в разных классах
  function OwlLibTools() {}

  OwlLibTools.prototype.cropStr = function(str, n) {
    if (str.length > n) {
      return str.substr(0, n) + '...';
    }
    return str;
  };

  OwlLibTools.prototype.consoleLog = function(str) {
    if (devMode === true) {
      console.log(str);
    }
  };

  OwlLibTools.prototype.ct = function(n, type) {
    if (typeof n === type) return true;
    else return false;
  };


  window.OL = window.OwlLib = new OwlLib();
})(window);
