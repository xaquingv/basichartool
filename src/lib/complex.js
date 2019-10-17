export default class Complex {

	constructor(re,im) {
		this.re = re;
		this.im = im || 0.0;
	}

	add(other, dst) {
		dst.re = this.re + other.re;
		dst.im = this.im + other.im;
		return dst;
	}

	sub(other, dst) {
		dst.re = this.re - other.re;
		dst.im = this.im - other.im;
		return dst;
	}

	mul(other, dst) {
		let r = this.re * other.re - this.im * other.im;
		dst.im = this.re * other.im + this.im * other.re;
		dst.re = r;
		return dst;
	}

	cexp(dst) {
		let er = Math.exp(this.re);
		dst.re = er * Math.cos(this.im);
		dst.im = er * Math.sin(this.im);
		return dst;
	}
}