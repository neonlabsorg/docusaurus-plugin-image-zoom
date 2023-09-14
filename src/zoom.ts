import siteConfig from '@generated/docusaurus.config';
import mediumZoom, { Zoom, ZoomOptions, ZoomSelector } from 'medium-zoom';

const { themeConfig } = siteConfig;

type ZoomConfig = {
  selector: ZoomSelector;
  background: {
    light: string;
    dark: string;
  };
  config: ZoomOptions;
};

function getBackgroundColor(zoom: ZoomConfig) {
  const isDarkMode = document.querySelector('html[data-theme="dark"]');

  return isDarkMode
    ? zoom.background?.dark || 'rgb(50, 50, 50)'
    : zoom.background?.light || 'rgb(255, 255, 255)';
}

export default (function() {
  if (typeof window === 'undefined') {
    return null;
  }

  let zoomObject: Zoom;

  const { zoom }: { zoom?: ZoomConfig } = themeConfig;
  const { selector = '.markdown img', config = {} } = zoom || ({} as ZoomConfig);

  if (!zoom) {
    return null;
  }

  const observer = new MutationObserver(() => {
    const background = getBackgroundColor(zoom);
    config['background'] = background;
    if (zoomObject) {
      zoomObject.update({ background });
    }
  });

  const htmlNode = document.querySelector('html');

  observer.observe(htmlNode!, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
      if (entry.contentRect.width < 1000) {
        zoomObject.update({ margin: config ? 6 : 0 });
      } else {
        zoomObject.update({ margin: config['margin'] ?? 0 });
      }
    }
  });

  resizeObserver.observe(htmlNode);

  setTimeout(() => {
    if (zoomObject) {
      zoomObject.detach();
    }

    zoomObject = mediumZoom(selector, config);
  }, 1000);

  return {
    onRouteUpdate() {
      setTimeout(() => {
        if (zoomObject) {
          zoomObject.detach();
        }

        zoomObject = mediumZoom(selector, config);
      }, 1000);
    }
  };
})();
