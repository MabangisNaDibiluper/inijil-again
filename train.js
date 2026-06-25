// Pixel-art train interior scene, drawn on canvas, no smoothing (true pixel-art look)
(function(){
  const canvas = document.getElementById('trainCanvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const W = canvas.width, H = canvas.height;
  const PX = 4; // pixel block size for drawing grid-based shapes

  function rect(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*PX, y*PX, w*PX, h*PX);
  }

  // simple seeded random for stable "random" station blips
  let seed = 7;
  function rnd(){ seed = (seed*9301+49297)%233280; return seed/233280; }

  function drawBackground(){
    // ceiling / wall gradient
    const grad = ctx.createLinearGradient(0,0,0,H);
    grad.addColorStop(0, '#dfe7ee');
    grad.addColorStop(0.55, '#cfd9e3');
    grad.addColorStop(1, '#b9c3cf');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);

    // ceiling panel lines
    ctx.strokeStyle = 'rgba(120,130,145,0.5)';
    ctx.lineWidth = 1;
    for(let x=0; x<W; x+=44){
      ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H*0.18); ctx.stroke();
    }
    rect(0, 0, W/PX, 6, '#aab4c2');

    // ceiling lights
    for(let x=20; x<W/PX; x+=46){
      rect(x, 4, 18, 4, '#fff7d6');
    }

    // floor
    rect(0, H/PX-14, W/PX, 14, '#8a93a3');
    for(let x=0; x<W/PX; x+=10){
      rect(x, H/PX-14, 1, 14, '#76808f');
    }

    // windows row with sky/scenery moving by
    const winY = 26, winH = 46;
    for(let wx=10; wx<W/PX-10; wx+=70){
      // window frame
      rect(wx-2, winY-2, 50, winH+4, '#9aa6b6');
      // sky
      rect(wx, winY, 46, winH, '#7ec8e3');
      // simple scenery: hill + sun, offset for parallax illusion (static here)
      const offset = (wx*1.3) % 200;
      rect(wx, winY+winH-10, 46, 10, '#5fae6e');
      rect(wx+8, winY+8, 10, 10, '#ffd166');
      rect(wx+30-((offset)%20), winY+30, 14, 6, '#ffffffcc');
    }

    // info board
    rect(40, 10, 70, 16, '#1a2230');
    ctx.fillStyle = '#5fae6e';
    ctx.font = '8px monospace';
    ctx.fillText('NEXT STOP', 168, 86);
  }

  // hanging strap handle
  function drawStrap(x){
    rect(x, 6, 2, 14, '#bdb6a8'); // strap line
    rect(x-3, 18, 8, 3, '#caa24a'); // handle ring top
    rect(x-5, 21, 12, 3, '#caa24a');
    rect(x-3, 24, 8, 2, '#caa24a');
  }

  // Character palette generator — simple pixel person, varied via params
  function drawPerson(x, baseY, opts){
    const {skin, hair, shirt, pants, holdingStrap, facing, accessory} = opts;
    // legs
    rect(x+2, baseY-10, 3, 10, pants);
    rect(x+7, baseY-10, 3, 10, pants);
    // shoes
    rect(x+1, baseY-1, 4, 2, '#3a2417');
    rect(x+7, baseY-1, 4, 2, '#3a2417');
    // torso
    rect(x, baseY-26, 12, 17, shirt);
    // arms
    if(holdingStrap){
      rect(x-2, baseY-30, 3, 14, skin); // raised arm
      rect(x+11, baseY-24, 3, 12, skin);
    } else {
      rect(x-2, baseY-22, 3, 12, skin);
      rect(x+11, baseY-22, 3, 12, skin);
    }
    // neck/head
    rect(x+3, baseY-32, 6, 6, skin);
    // hair
    rect(x+2, baseY-36, 8, 5, hair);
    if(facing === 'side') rect(x+8, baseY-34, 2, 3, hair);
    // accessory (backpack strap / headphones / bag)
    if(accessory === 'backpack'){
      rect(x-3, baseY-25, 3, 14, '#3a6ea5');
    }
    if(accessory === 'headphones'){
      rect(x+1, baseY-37, 9, 2, '#222');
      rect(x+0, baseY-33, 2, 4, '#222');
      rect(x+10, baseY-33, 2, 4, '#222');
    }
    if(accessory === 'phone'){
      rect(x+10, baseY-20, 3, 4, '#111');
    }
  }

  function drawScene(){
    drawBackground();

    // hanging straps along the top
    const strapXs = [60, 110, 160, 210, 260, 600, 650, 700, 750, 800];
    strapXs.forEach(sx => drawStrap(sx));

    const baseY = H/PX - 14;

    // people lineup, varied like the reference image
    drawPerson(8,  baseY, {skin:'#e0a878', hair:'#f4c94a', shirt:'#f4c94a', pants:'#8a8a8a', holdingStrap:false, facing:'front', accessory:'phone'});
    drawPerson(40, baseY, {skin:'#caa07a', hair:'#3a2417', shirt:'#dfe3e8', pants:'#3a4a63', holdingStrap:true, facing:'side', accessory:'backpack'});
    drawPerson(70, baseY, {skin:'#9c6b4f', hair:'#1a1a1a', shirt:'#1a1a1a', pants:'#5a6470', holdingStrap:true, facing:'front', accessory:null});
    drawPerson(100,baseY, {skin:'#e0b48f', hair:'#5b3a29', shirt:'#7ec8e3', pants:'#5fae6e', holdingStrap:true, facing:'front', accessory:'backpack'});
    drawPerson(132,baseY, {skin:'#caa07a', hair:'#2a1f1a', shirt:'#b5a8c9', pants:'#3a3a3a', holdingStrap:false, facing:'side', accessory:null});

    // bench sitters (right side), simplified seated figures
    rect(150, baseY-14, 60, 14, '#8a6a4a'); // bench seat
    drawSeated(160, baseY-14, '#caa07a', '#3a3a3a', '#caa24a');
    drawSeated(178, baseY-14, '#9c6b4f', '#1a1a1a', '#5fae6e');
    drawSeated(196, baseY-14, '#e0b48f', '#5b3a29', '#ef5d7c');

    function drawSeated(x,y,skin,shirt,pants){
      rect(x, y-16, 8, 9, shirt);
      rect(x+1, y-20, 6, 5, skin);
      rect(x, y-23, 8, 4, '#1a1a1a');
      rect(x, y-7, 8, 7, pants);
    }

    drawPerson(214,baseY, {skin:'#caa07a', hair:'#caa24a', shirt:'#caa24a', pants:'#8a8a8a', holdingStrap:true, facing:'front', accessory:'headphones'});

    // foreground silhouette figures (cropped, like reference image edges)
    rect(-4, baseY-34, 16, 34, 'rgba(20,15,25,0.55)');
    rect(W/PX-12, baseY-36, 16, 36, 'rgba(20,15,25,0.5)');

    // floating signage pixel icons near ceiling
    drawSignIcon(120, 8, '#ef5d7c');
    drawSignIcon(300, 8, '#7ec8e3');
    drawSignIcon(560, 8, '#f4c94a');

    function drawSignIcon(x,y,color){
      rect(x, y, 10, 8, '#1a2230');
      rect(x+2, y+2, 6, 4, color);
    }
  }

  drawScene();

  // gentle parallax sway animation
  let t = 0;
  function animate(){
    t += 0.01;
    ctx.save();
    ctx.clearRect(0,0,W,H);
    ctx.translate(Math.sin(t)*1.2, 0);
    drawScene();
    ctx.restore();
    requestAnimationFrame(animate);
  }
  animate();
})();
