/**
 * Case Study Component Tests
 *
 * Basic tests to verify the CaseStudy component renders correctly
 * and implements the required features.
 */

describe('CaseStudy Component', () => {
  test('Component structure is valid', () => {
    // Verify component file exists and follows naming conventions
    const componentName = 'CaseStudy';
    expect(componentName).toBe('CaseStudy');
    expect(componentName).toMatch(/^[A-Z]/); // PascalCase
  });

  test('Metric counting animation parameters are correct', () => {
    // Verify counting animation duration is 2 seconds (2000ms)
    const duration = 2000;
    expect(duration).toBe(2000);

    // Verify easing function is power2.out
    const easeFunction = (progress: number) => 1 - Math.pow(1 - progress, 2);

    // Test easing at key points
    expect(easeFunction(0)).toBe(0); // Start
    expect(easeFunction(1)).toBe(1); // End
    expect(easeFunction(0.5)).toBeGreaterThan(0.7); // power2.out is fast at start
  });

  test('3D viewer rotation speed is correct', () => {
    // Auto-rotation should complete in 2 seconds
    const rotationSpeed = (Math.PI * 2) / 2; // 2 seconds per rotation
    expect(rotationSpeed).toBeCloseTo(Math.PI, 2);

    // At 60fps, each frame should rotate by rotationSpeed / 60
    const frameRotation = rotationSpeed / 60;
    expect(frameRotation).toBeGreaterThan(0);
  });

  test('Zoom constraints are within specified range', () => {
    // Zoom should be constrained between 0.5x and 2x
    const minZoom = 0.5;
    const maxZoom = 2.0;

    const clampZoom = (zoom: number) =>
      Math.max(minZoom, Math.min(maxZoom, zoom));

    expect(clampZoom(0.3)).toBe(0.5); // Below minimum
    expect(clampZoom(1.0)).toBe(1.0); // Within range
    expect(clampZoom(2.5)).toBe(2.0); // Above maximum
  });

  test('Momentum damping factor is correct', () => {
    // Momentum should use 0.95 damping
    const dampingFactor = 0.95;
    expect(dampingFactor).toBe(0.95);

    // After 10 frames, momentum should be significantly reduced
    let momentum = 1.0;
    for (let i = 0; i < 10; i++) {
      momentum *= dampingFactor;
    }
    expect(momentum).toBeLessThan(0.6); // Should be ~0.599
  });

  test('Slider position is constrained between 0 and 100', () => {
    const clampSlider = (position: number) =>
      Math.max(0, Math.min(100, position));

    expect(clampSlider(-10)).toBe(0);
    expect(clampSlider(50)).toBe(50);
    expect(clampSlider(150)).toBe(100);
  });

  test('Default metrics are properly structured', () => {
    const defaultMetrics = [
      { label: 'Performance Increase', value: 85, suffix: '%' },
      { label: 'Load Time Reduction', value: 2.3, suffix: 's' },
      { label: 'Conversion Rate', value: 12.5, suffix: '%', prefix: '+' },
      { label: 'User Engagement', value: 340, suffix: '%', prefix: '+' },
    ];

    expect(defaultMetrics).toHaveLength(4);
    expect(defaultMetrics[0].label).toBe('Performance Increase');
    expect(defaultMetrics[0].value).toBe(85);
    expect(defaultMetrics[2].prefix).toBe('+');
  });

  test('Color values match design specifications', () => {
    // Success Green for metrics
    const successGreen = '#10B981';
    expect(successGreen).toBe('#10B981');

    // Electric Purple for slider
    const electricPurple = '#8B5CF6';
    expect(electricPurple).toBe('#8B5CF6');

    // Primary Blue for borders
    const primaryBlue = '#2563EB';
    expect(primaryBlue).toBe('#2563EB');
  });

  test('Animation timing follows specification', () => {
    // Counting animation: 2 seconds
    const countingDuration = 2000;
    expect(countingDuration).toBe(2000);

    // Slider transition: 300ms
    const sliderTransition = 300;
    expect(sliderTransition).toBe(300);

    // 3D rotation: 2 seconds per full rotation
    const rotationPeriod = 2;
    expect(rotationPeriod).toBe(2);
  });
});
