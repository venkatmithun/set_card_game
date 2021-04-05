export function Card(id, properties) {
  this.id = id;
  this.attr = {
    color: properties.colors[Math.floor((id % 81) / 27)], // color will change every 27 cards
    number: properties.numbers[Math.floor((id % 27) / 9)], // number will change every 9 cards
    shade: properties.shades[Math.floor((id % 9) / 3)], // shade will change every 3 cards
    shape: properties.shapes[Math.floor(id % 3)],
  };
}
