@placenames: #222;
@placenames-light: #777777;
.country {
  [admin_level = '2'][zoom >= 2][way_pixels > 3000][way_pixels < 196000] {
    text-name: "[name]";
    text-size: 9;
    text-fill: #9d6c9d;
    text-face-name: @book-fonts;
    text-halo-radius: 1.5;
    text-wrap-width: 50;
    text-placement: interior;
    [zoom >= 4] {
      text-size: 10;
    }
  }
}

.state {
  [admin_level = '4'] {
    [zoom >= 4][zoom < 5][way_pixels > 750][way_pixels < 196000],
    [zoom >= 5][way_pixels > 3000][way_pixels < 196000] {
      text-name: "[ref]";
      text-size: 9;
      text-fill: #9d6c9d;
      text-face-name: @oblique-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 0;
      text-placement: interior;
      [zoom >= 5] {
        text-name: "[name]";
        text-wrap-width: 50;
      }
      [zoom >= 7] {
        text-size: 11;
        text-wrap-width: 70;
      }
    }
  }
}

#placenames-capital {
  [zoom >= 6][zoom < 15] {
    text-name: "[name]";
    text-size: 10;
    text-fill: @placenames;
    text-face-name: @book-fonts;
    text-halo-radius: 1.5;
    text-wrap-width: 25;
    text-min-distance: 10;
    [zoom >= 6] {
      text-size: 12;
      text-wrap-width: 70;
    }
    [zoom >= 11] {
      text-size: 15;
      text-wrap-width: 90;
    }
  }
}

#placenames-medium::city {
  [place = 'city'] {
    [zoom >= 6][zoom < 15] {
      text-name: "[name]";
      text-size: 9;
      text-fill: @placenames;
      text-face-name: @book-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 25;
      text-min-distance: 10;
      [zoom >= 9] {
        text-size: 12;
      text-wrap-width: 70;
      }
      [zoom >= 11] {
        text-size: 15;
      text-wrap-width: 90;
      }
    }
  }
}

#placenames-medium::town {
  // Special style for northern communities
  [place = 'town'][latitude >= 60] {
    [zoom >= 7] {
      text-name: "[name]";
      text-size: 9;
      text-fill: @placenames;
      text-face-name: @book-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 50;
      text-min-distance: 10;
    }
    [zoom >= 11] {
      text-size: 11;
      text-wrap-width: 70;
    }
    [zoom >= 14] {
      text-size: 15;
      text-wrap-width: 90;
      text-fill: @placenames-light;
    }
  }
  [place = 'town'][latitude < 60] {
    [zoom >= 9] {
      text-name: "[name]";
      text-size: 9;
      text-fill: @placenames;
      text-face-name: @book-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 50;
      text-min-distance: 10;
    }
    [zoom >= 11] {
      text-size: 11;
      text-wrap-width: 70;
    }
    [zoom >= 14] {
      text-size: 15;
      text-wrap-width: 90;
      text-fill: @placenames-light;
    }
  }
}

#placenames-small::suburb {
  [place = 'suburb'][zoom >= 12] {
    text-name: "[name]";
    text-size: 11;
    text-fill: @placenames;
    text-face-name: @book-fonts;
    text-halo-radius: 1.5;
    text-wrap-width: 70;
    text-min-distance: 10;
    [zoom >= 14] {
      text-size: 14;
      text-wrap-width: 90;
      text-fill: @placenames-light;
    }
  }
}

#placenames-small::village {
// Special style for northern communities
[place = 'village'][latitude > 60] {
  [zoom >= 7] {
    text-name: "[name]";
    text-size: 9;
    text-fill: @placenames;
    text-face-name: @book-fonts;
    text-halo-radius: 1.5;
    text-wrap-width: 50;
    text-min-distance: 10;
    [zoom >= 15] {
      text-size: 13;
      text-fill: @placenames-light;
    }
  }
}
  [place = 'village'][latitude < 60] {
    [zoom >=12] {
      text-name: "[name]";
      text-size: 10;
      text-fill: @placenames;
      text-face-name: @book-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 50;
      text-min-distance: 10;
      [zoom >= 15] {
        text-size: 13;
        text-fill: @placenames-light;
      }
    }
  }
}

#placenames-small::hamlet {
// Special style for northern communities
[place = 'hamlet'][latitude > 60] {
  [zoom >= 7] {
    text-name: "[name]";
    text-size: 9;
    text-fill: @placenames;
    text-face-name: @book-fonts;
    text-halo-radius: 1.5;
    text-wrap-width: 50;
    text-min-distance: 10;
    [zoom >= 15] {
      text-size: 13;
      text-fill: @placenames-light;
    }
  }
}
  [place = 'hamlet'][latitude < 60] {
    [zoom >= 14] {
      text-name: "[name]";
      text-size: 10;
      text-fill: @placenames;
      text-face-name: @book-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 50;
      text-min-distance: 10;
      [zoom >= 15] {
        text-size: 13;
        text-fill: @placenames-light;
      }
    }
  }
}

#placenames-small::generic {
  [place = 'locality'],
  [place = 'neighbourhood'],
  [place = 'isolated_dwelling'],
  [place = 'farm'] {
    [zoom >= 14] {
      text-name: "[name]";
      text-size: 9;
      text-fill: @placenames;
      text-face-name: @book-fonts;
      text-halo-radius: 1.5;
      text-wrap-width: 50;
      text-min-distance: 10;
    }
    [zoom >= 16] {
      text-size: 12;
      text-wrap-width: 70;
      text-fill: @placenames-light;
    }
  }
}
