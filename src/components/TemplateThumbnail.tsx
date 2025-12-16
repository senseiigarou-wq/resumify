
import React, { useRef, useState, useEffect } from 'react';
import { Template, TemplateType } from '../types';
import { INITIAL_RESUME_DATA } from '../constants';
import OnyxTemplate from './templates/OnyxTemplate';
import QuartzTemplate from './templates/QuartzTemplate';
import CanvasTemplate from './templates/CanvasTemplate';
import DynamicTemplate from './templates/DynamicTemplate';
import HorizonTemplate from './templates/HorizonTemplate';

interface Props {
  template: Template;
}

const TemplateThumbnail: React.FC<Props> = ({ template }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        // Standard A4 width in pixels (approximate for web display at 96 DPI)
        // 210mm * 3.7795 px/mm ~= 794px
        const a4Width = 794; 
        
        // Ensure we don't divide by zero or result in negative/infinite scale
        if (parentWidth > 0) {
            setScale(parentWidth / a4Width);
        }
      }
    };

    // Calculate initial scale
    updateScale();

    // Recalculate on resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderContent = () => {
    // We use the initial data as the 'Sample Data' for the preview to show real text/layout
    const data = INITIAL_RESUME_DATA;
    
    // Legacy Template Mapping
    if (template.id === TemplateType.ONYX) return <OnyxTemplate data={data} />;
    if (template.id === TemplateType.QUARTZ) return <QuartzTemplate data={data} />;
    if (template.id === TemplateType.CANVAS) return <CanvasTemplate data={data} />;
    
    // New Horizon
    if (template.id === TemplateType.HORIZON) return <HorizonTemplate data={data} layout="sidebar" />;
    if (template.id === 'HORIZON_MINIMAL') return <HorizonTemplate data={data} layout="single" />;
    
    // Dynamic Template Mapping
    if (template.isDynamic && template.config) {
        return <DynamicTemplate data={data} config={template.config} />;
    }
    
    // Fallback
    return <OnyxTemplate data={data} />;
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden bg-white relative select-none isolate">
       {/* 
         We render the template at full A4 size (794px width) 
         and scale it down via CSS transform to fit the container width.
       */}
       <div 
         style={{ 
             width: '794px', 
             minHeight: '1123px', // Standard A4 Height
             transform: `scale(${scale}) translateZ(0)`, // translateZ for GPU promotion
             transformOrigin: 'top left',
         }}
         className="pointer-events-none shadow-sm bg-white origin-top-left"
         aria-hidden="true"
       >
          {renderContent()}
       </div>
    </div>
  );
};

export default TemplateThumbnail;
