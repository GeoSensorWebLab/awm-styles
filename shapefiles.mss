#necountries {
  [zoom >= 1][zoom < 4] {
    line-width: 0.5;
    line-color: grey;
  }
}

#world {
  [zoom >= 0][zoom < 10] {
    polygon-fill: @land-color;
  }
}

#coast-poly {
  [zoom >= 10] {
    polygon-fill: @land-color;
  }
}

#builtup {
  [zoom >= 8][zoom < 10] {
    polygon-fill: #ddd;
  }
}

#geographic-lines {
  [name = 'Arctic Circle'] {
    line-width: 1;
    line-opacity: 0.5;
    line-color: #116688;
    line-clip: false;

    text-name: "[name]";
    text-face-name: @book-fonts;
    text-placement: line;
    text-halo-radius: 2;
    text-spacing: 800;
    text-clip: false;
  }
}

#graticule-lines {
  [display = '45 N'] {
    line-width: 1;
    line-opacity: 0.5;
    line-color: #116688;
    line-clip: false;

    text-name: "[display]";
    text-face-name: @book-fonts;
    text-placement: line;
    text-halo-radius: 2;
    text-spacing: 800;
    text-clip: false;
  }
}
