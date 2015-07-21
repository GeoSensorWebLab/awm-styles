#contours20 {
  [zoom >= 12][zoom < 14] {
    line-width: 0.5;
    line-opacity: 0.5;
    line-color: #96733c;
    line-clip: false;
  }

  [zoom >= 14] {
 	  line-width: 0.6;
    line-opacity: 0.5;
    line-color: #96733c;
    line-clip: false;

    text-name: "[elevation]";
    text-face-name: @book-fonts;
    text-size: 8;
    text-fill: #96733c;
    text-placement: line;
    text-halo-radius: 1;
    text-clip: false;
  }
}

#contours100 {
  [zoom >= 10][zoom < 13] {
    line-width: 0.7;
    line-opacity: 0.5;
    line-color: #db6d46;
    line-clip: false;
  }

  [zoom >= 13] {
 	  line-width: 0.8;
    line-opacity: 0.5;
    line-color: #db6d46;
    line-clip: false;

    text-name: "[elevation]";
    text-face-name: @book-fonts;
    text-size: 8;
    text-fill: #db6d46;
    text-placement: line;
    text-halo-radius: 1;
    text-clip: false;
  }
}
