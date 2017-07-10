#necountries {
  [zoom >= 1][zoom < 4] {
    line-width: 0.2;
    [zoom >= 2] {
      line-width: 0.3;
    }
    [zoom >= 3] {
      line-width: 0.4;
    }
    line-color: @admin-boundaries;
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

/* For the bathymetry features */

#bathymetry-10km {
  polygon-fill: darken(@water-color, 38%);
}

#bathymetry-9km {
  polygon-fill: darken(@water-color, 35%);
}

#bathymetry-8km {
  polygon-fill: darken(@water-color, 32%);
}

#bathymetry-7km {
  polygon-fill: darken(@water-color, 29%);
}

#bathymetry-6km {
  polygon-fill: darken(@water-color, 26%);
}

#bathymetry-5km {
  polygon-fill: darken(@water-color, 23%);
}

#bathymetry-4km {
  polygon-fill: darken(@water-color, 20%);
}

#bathymetry-3km {
  polygon-fill: darken(@water-color, 17%);
}

#bathymetry-2km {
  polygon-fill: darken(@water-color, 14%);
}

#bathymetry-1km {
  polygon-fill: darken(@water-color, 11%);
}

#bathymetry-200m {
  polygon-fill: darken(@water-color, 8%);
}

#lakes-low [zoom >= 4][zoom < 6] {
  polygon-fill: @water-color;
}
