/* global NexT: true */

// 文档加载完成后初始化滚动监听功能
$(document).ready(function () {
  initScrollSpy();

  // 初始化滚动监听功能
  function initScrollSpy() {
    var tocSelector = '.post-toc';
    var $tocElement = $(tocSelector);
    var activeCurrentSelector = '.active-current';

    // 激活滚动监听事件处理
    $tocElement
      .on('activate.bs.scrollspy', function () {
        var $currentActiveElement = $(tocSelector + ' .active').last();

        removeCurrentActiveClass();
        $currentActiveElement.addClass('active-current');

        // Scrolling to center active TOC element if TOC content is taller then viewport.
        $tocElement.scrollTop($currentActiveElement.offset().top - $tocElement.offset().top + $tocElement.scrollTop() - ($tocElement.height() / 2));
      })
      .on('clear.bs.scrollspy', removeCurrentActiveClass);

    // 设置滚动监听目标
    $('body').scrollspy({target: tocSelector});

    // 移除当前活动类
    function removeCurrentActiveClass() {
      $(tocSelector + ' ' + activeCurrentSelector)
        .removeClass(activeCurrentSelector.substring(1));
    }
  }

  // 处理目录点击展开/折叠
  $('.post-toc .nav-item').on('click', function (e) {
    e.stopPropagation(); // 阻止事件冒泡

    var $this = $(this);
    var $subNav = $this.children('.nav-child');

    // 如果有子目录
    if ($subNav.length > 0) {
      e.preventDefault(); // 阻止默认跳转
      $subNav.slideToggle(200);
      $this.toggleClass('expanded');
    }
  });

  // 初始展开当前活动的目录项
  function expandActiveNav() {
    var $activeItem = $('.post-toc .active-current').parent();
    $activeItem.parents('.nav-child').show();
    $activeItem.parents('.nav-item').addClass('expanded');
  }

  // 首次加载时展开
  expandActiveNav();

  // 滚动时保持展开状态
  $(window).on('activate.bs.scrollspy', function () {
    expandActiveNav();
  });
});

// 处理侧边栏导航点击事件
$(document).ready(function () {
  var html = $('html');
  var TAB_ANIMATE_DURATION = 200;
  var hasVelocity = $.isFunction(html.velocity);

  // 侧边栏导航项点击事件处理
  $('.sidebar-nav li').on('click', function () {
    var item = $(this);
    var activeTabClassName = 'sidebar-nav-active';
    var activePanelClassName = 'sidebar-panel-active';
    if (item.hasClass(activeTabClassName)) {
      return;
    }

    var currentTarget = $('.' + activePanelClassName);
    var target = $('.' + item.data('target'));

    // 使用Velocity.js或jQuery进行动画切换
    hasVelocity ? currentTarget.velocity('transition.slideUpOut', TAB_ANIMATE_DURATION, function () {
      target
        .velocity('stop')
        .velocity('transition.slideDownIn', TAB_ANIMATE_DURATION)
        .addClass(activePanelClassName);
    }) : currentTarget.animate({opacity: 0}, TAB_ANIMATE_DURATION, function () {
      currentTarget.hide();
      target
        .stop()
        .css({'opacity': 0, 'display': 'block'})
        .animate({opacity: 1}, TAB_ANIMATE_DURATION, function () {
          currentTarget.removeClass(activePanelClassName);
          target.addClass(activePanelClassName);
        });
    });

    item.siblings().removeClass(activeTabClassName);
    item.addClass(activeTabClassName);
  });

  // TOC 链接点击事件处理
  $('.post-toc a').on('click', function (e) {
    e.preventDefault();
    var targetId = decodeURIComponent($(this).attr('href'));
    var target = $(targetId);
    // 如果目标存在，滚动到目标位置
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 500);
    }
  });

  // 默认展开侧边栏（如果有TOC）
  var $tocContent = $('.post-toc-content');
  var isSidebarCouldDisplay = CONFIG.sidebar.display === 'post' || CONFIG.sidebar.display === 'always';
  var hasTOC = $tocContent.length > 0 && $tocContent.html().trim().length > 0;
  if (isSidebarCouldDisplay && hasTOC) {
    CONFIG.motion.enable ? (NexT.motion.middleWares.sidebar = function () {
      NexT.utils.displaySidebar();
    }) : NexT.utils.displaySidebar();
  }
});
