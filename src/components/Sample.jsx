import React, { useEffect, useState, useRef } from 'react';
import { animated, useSpring } from 'react-spring';

import StarSvg from './Star';
import FadeIn from './FadeIn';

function useIntersectionObserver(
  elementRef,
    { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }
  ) {
	const [entry, setEntry] = useState();
	const frozen = entry?.isIntersecting && freezeOnceVisible;

	const updateEntry = ([entry]) => {
		setEntry(entry);
	};

	useEffect(() => {
		const node = elementRef?.current;
		const hasIOSupport = !!window.IntersectionObserver;

		if (!hasIOSupport || frozen || !node) return;

		const observerParams = { threshold, root, rootMargin };
		const observer = new IntersectionObserver(updateEntry, observerParams);

		observer.observe(node);

		return () => observer.disconnect();
	}, [elementRef, threshold, root, rootMargin, frozen]);

	return entry;
}

export default function Sample() {
  const triggerRef = useRef();
  const dataRef = useIntersectionObserver(triggerRef, {
    freezeOnceVisible: true
  });

  const headerStyle = useSpring({
    config: { duration: 500 },
    from: { opacity: 0, left: '-500px' },
    to: {
      opacity: dataRef?.isIntersecting ? 1 : 0,
      left: dataRef?.isIntersecting ? '0px' : '-500px',
    },
  });

  return (
    <div className="App">
      <FadeIn />
      <div style={{ backgroundColor: "grey", height:'750px' }}>
        <h1>Scroll Down</h1>
      </div>
      <div style={{ backgroundColor: "white", height:'750px' }}>
        <animated.h2 style={headerStyle}>
          <StarSvg />
        </animated.h2>
        <div ref={triggerRef} />
      </div>
    </div>
  )
}
