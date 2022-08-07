export default class BasicCamera {
    constructor(origin, direction, up, film, zoom = 1) {
        this.origin = origin;
        this.film = film;
        this.zoom = zoom;
        this.up = up.normalise();
        this.direction = direction.normalise();
    }
    getRay(sample, pixel) {
        const filmPosition = this.film.getFilmPosition(pixel, sample.filmPos);
        const right = this.direction.cross(this.up);
        const up = right.cross(this.direction);
        // determine the center of the near plane
        const down = up.multiply(-1);
        const planeCenter = this.origin.add(this.direction.multiply(this.zoom));
        const topLeft = planeCenter
            .subtract(down.multiply(0.5))
            .subtract(right.multiply(0.5));
        const filmPos = topLeft
            .add(right.multiply(filmPosition.x))
            .add(down.multiply(filmPosition.y));
        const direction = filmPos.subtract(this.origin).normalise();
        return {
            origin: this.origin,
            direction,
            time: 0,
            length: null,
        };
    }
    recordRadiances(radiances, sample, pixel) {
        this.film.splat(radiances, sample, pixel);
    }
}
