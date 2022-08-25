class Movprom {
    constructor(n) {
      this.arr = [];
      this.N = n;
    }

    nuevoDato(dat) {
      this.arr.push(dat);
      if (this.arr.length > this.N) {
        this.arr.shift();
      }
      
      var acc = 0.0;
      for (var i = 0; i < this.arr.length; i++) {
        acc += parseFloat(this.arr[i]);
      }
      acc /= this.arr.length;
      return acc;
    }
  }
