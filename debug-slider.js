// Debug slider rendering - run in console
function debugSlider() {
  const results = [];
  const sliders = document.querySelectorAll('.pageIndicator__slider');
  
  results.push(`Found ${sliders.length} slider elements`);
  
  if (!sliders.length) {
    results.push('❌ No slider elements found in DOM');
    const tracks = document.querySelectorAll('.pageIndicator__track');
    results.push(`Found ${tracks.length} tracks`);
    if (tracks.length) {
      results.push('Track HTML:', tracks[0].innerHTML);
    }
    return results.join('\n');
  }
  
  sliders.forEach((slider, i) => {
    results.push(`\n=== Slider ${i + 1} ===`);
    
    const computed = getComputedStyle(slider);
    results.push(`Display: ${computed.display}`);
    results.push(`Position: ${computed.position}`);
    results.push(`Width: ${computed.width}`);
    results.push(`Height: ${computed.height}`);
    results.push(`Background: ${computed.background}`);
    results.push(`Z-index: ${computed.zIndex}`);
    results.push(`Transform: ${computed.transform}`);
    results.push(`Opacity: ${computed.opacity}`);
    results.push(`Visibility: ${computed.visibility}`);
    
    // Check parent
    const parent = slider.parentElement;
    if (parent) {
      const parentComputed = getComputedStyle(parent);
      results.push(`Parent position: ${parentComputed.position}`);
      results.push(`Parent overflow: ${parentComputed.overflow}`);
    }
  });
  
  return results.join('\n');
}

console.log(debugSlider());
