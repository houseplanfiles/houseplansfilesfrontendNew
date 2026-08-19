"use client";

import React, { CSSProperties, ElementType } from "react";

// All framer-motion specific props that should NOT be passed to DOM elements
const MOTION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants', 'whileHover',
  'whileTap', 'whileInView', 'whileFocus', 'whileDrag', 'viewport',
  'layout', 'layoutId', 'onAnimationStart', 'onAnimationComplete',
  'onUpdate', 'onHoverStart', 'onHoverEnd', 'onTapStart', 'onTap',
  'onTapCancel', 'drag', 'dragConstraints', 'dragElastic', 'dragMomentum',
  'dragTransition', 'dragPropagation', 'layoutDependency', 'custom',
  'inherit', 'transformTemplate', 'transformValues', 'onPan', 'onPanStart',
  'onPanEnd', 'onDirectionLock', 'onDragStart', 'onDrag', 'onDragEnd',
]);

function filterMotionProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {};
  for (const key in props) {
    if (!MOTION_PROPS.has(key)) {
      filtered[key] = props[key];
    }
  }
  return filtered;
}

function toStyle(obj?: Record<string, any>): CSSProperties {
  if (!obj) return {};
  const css: CSSProperties = {};
  if (obj.opacity !== undefined) css.opacity = obj.opacity;
  if (obj.y !== undefined) css.transform = `translateY(${obj.y}px)`;
  if (obj.x !== undefined) css.transform = `translateX(${obj.x}px)`;
  if (obj.scale !== undefined) css.transform = `scale(${obj.scale})`;
  if (obj.scaleX !== undefined) css.transform = `scaleX(${obj.scaleX})`;
  if (obj.rotate !== undefined) css.transform = `rotate(${obj.rotate}deg)`;
  return css;
}

function MotionComponent(tag: ElementType) {
  return function Component({ children, initial, animate, whileInView, transition, style, className, onClick, ...rest }: any) {
    const duration = transition?.duration ?? 0.5;
    
    // Always render in the final "animated" state immediately to avoid JS execution
    const animStyle = toStyle(whileInView || animate || initial);
    const domProps = filterMotionProps(rest);

    return React.createElement(
      tag,
      {
        className,
        style: { transition: `all ${duration}s ease`, ...animStyle, ...style },
        onClick,
        ...domProps,
      },
      children
    );
  };
}

export const motion = {
  div: MotionComponent('div'),
  section: MotionComponent('section'),
  p: MotionComponent('p'),
  h1: MotionComponent('h1'),
  h2: MotionComponent('h2'),
  h3: MotionComponent('h3'),
  h4: MotionComponent('h4'),
  span: MotionComponent('span'),
  button: MotionComponent('button'),
  li: MotionComponent('li'),
  ul: MotionComponent('ul'),
  ol: MotionComponent('ol'),
  a: MotionComponent('a'),
  img: MotionComponent('img'),
  article: MotionComponent('article'),
  aside: MotionComponent('aside'),
  nav: MotionComponent('nav'),
  header: MotionComponent('header'),
  footer: MotionComponent('footer'),
  main: MotionComponent('main'),
};

export function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const useAnimation = () => ({ start: () => {}, stop: () => {}, set: () => {} });
export const useInView = () => true;
export const useMotionValue = (initial: number) => ({ get: () => initial, set: () => {} });
export const useTransform = () => ({ get: () => 0 });
