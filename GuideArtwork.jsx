import React from 'react';

const labels = ['Cloud selection', 'Credits & value', 'Account security'];
export default function GuideArtwork({ index = 0 }) {
  return (
    <div className="guide-art guide-art-refined" aria-hidden="true">
      <span className="guide-art-rail guide-art-rail-left" />
      <span className="guide-art-rail guide-art-rail-right" />
      <span className="guide-symbol-frame">
        <span className="guide-symbol-tile">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {index === 0 ? (
              <>
                <path d="M13 31a8 8 0 0 1-1-16 12 12 0 0 1 23-2 9 9 0 0 1 1 18H13Z" />
                <path d="M17 24h14m-7-7v14" />
                <path d="M14 37h20" opacity=".5" />
              </>
            ) : index === 1 ? (
              <>
                <path d="m24 8 17 8-17 8L7 16l17-8Z" />
                <path d="m8 24 16 8 16-8M8 32l16 8 16-8" />
                <path
                  d="m24 12 8 4-8 4-8-4 8-4Z"
                  stroke="none"
                  fill="currentColor"
                  opacity=".18"
                />
              </>
            ) : (
              <>
                <path d="M24 6 39 12v11c0 10-9 16-15 19C18 39 9 33 9 23V12L24 6Z" />
                <path d="m17 23 5 5 10-11" />
                <path d="M24 11 14 15v8" opacity=".35" />
              </>
            )}
          </svg>
        </span>
      </span>
      <span className="guide-art-caption">{labels[index] || labels[0]}</span>
    </div>
  );
}
