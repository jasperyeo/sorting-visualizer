export function pop(event: any) { 
  for (let i = 0; i < 30; i++) {
    createParticle(event.x, event.y);
  }
}

function createParticle(x: number, y: number) {
  const particle = document.createElement('particle');
  const container = document.getElementById('sort__container');
  container?.appendChild(particle);
  const size = Math.floor(Math.random() * 10 + 5);
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.background = `hsl(${Math.random() * 90}, 70%, 60%)`;
  const destinationX = x + (Math.random() - 0.5) * 2 * 75;
  const destinationY = y + (Math.random() - 0.5) * 2 * 75;
  const animation = particle.animate([
    {
      transform: `translate(${x - (size / 2)}px, ${y - (size / 2)}px)`,
      opacity: 1
    },
    {
      transform: `translate(${destinationX}px, ${destinationY}px)`,
      opacity: 0
    }
  ], {
    duration: 500 + Math.random() * 1000,
    easing: 'cubic-bezier(0, .9, .57, 1)',
    delay: Math.random() * 200
  });
  animation.onfinish = () => {
    particle.remove();
  };
}