export default class BasicShape {
    constructor(vertices, faces) {
        this.vertices = vertices;
        this.faces = faces;
    }
    intersect(ray) {
        let minDistance = null;
        this.faces.forEach((vertexIndices) => {
            const tri = [
                this.vertices[vertexIndices[0]],
                this.vertices[vertexIndices[1]],
                this.vertices[vertexIndices[2]],
            ];
            const faceDistance = this.checkCollision(ray, tri);
            if (faceDistance === null) {
                return;
            }
            if (minDistance === null || faceDistance < minDistance) {
                minDistance = faceDistance;
            }
        });
        return minDistance;
    }
    checkCollision(ray, tri) {
        const p = ray.origin;
        const d = ray.direction.normalise();
        const a = tri[0];
        const b = tri[1];
        const c = tri[2];
        const ab = b.subtract(a);
        const ac = c.subtract(a);
        const normal = ab.cross(ac).normalise();
        const offset = normal.dot(a);
        // normal and d represent the supporting plane of the triangle
        // if normal.dot(d) === 0, path is perpendicular to plane.
        if (normal.dot(d) === 0) {
            // no intersection because ray is parralel to plane
            return null;
        }
        else {
            // ray is not parralel
            const rayDistance = (offset - normal.dot(p)) / (normal.dot(d));
            // q = p + d * t where q, p and d are vectors, and t is a scalar
            const q = p.add(d.multiply(rayDistance));
            // we have q which is in the triangle's supporting plane
            // determine whether it is inside the triangles by looking at
            // its cross product with vectors representing the borders of the triangle
            const aq = q.subtract(a);
            const bc = c.subtract(b);
            const bq = q.subtract(b);
            const ca = a.subtract(c);
            const cq = q.subtract(c);
            if ((ab.cross(aq).dot(normal) >= 0) &&
                (bc.cross(bq).dot(normal) >= 0) &&
                (ca.cross(cq).dot(normal) >= 0)) {
                return rayDistance;
            }
            else {
                return null;
            }
        }
    }
}
