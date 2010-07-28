/*
    Copyright 2008,2009
        Matthias Ehmann,
        Michael Gerhaeuser,
        Carsten Miller,
        Bianca Valentin,
        Alfred Wassermann,
        Peter Wilfahrt

    This file is part of JSXGraph.

    JSXGraph is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JSXGraph is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with JSXGraph. If not, see <http://www.gnu.org/licenses/>.
*/

/** 
 * @fileoverview In this file the namespace JXG.Math is defined, which is the base namespace
 * for namespaces like Math.Numerics, Math.Algebra, Math.Statistics etc.
 * @author graphjs
 */
 
 /**
  * Math namespace.
  */
JXG.Math = {
    /**
     * eps defines the closeness to zero. If the absolute value of a given number is smaller than eps, it is considered to be equal to zero.
     * @type number
     */
    eps: 0.000001,

    /**
     * Multiplies a vector vec to a matrix mat: mat * vec. The matrix is interpreted by this function as an array of rows. Please note: This
     * function does not check if the dimensions match.
     * @param {Array} mat Two dimensional array of numbers. The inner arrays describe the columns, the outer ones the matrix' rows.
     * @param {Array} vec Array of numbers
     * @returns {Array} Array of numbers containing the result
     * @example
     * var A = [[2, 1],
     *              [1, 3]],
     *     b = [4, 5],
     *     c;
     * c = JXG.Math.matVecMult(A, b)
     * // c === [13, 19];
     */
    matVecMult: function(mat, vec) {
        var m = mat.length,
            n = vec.length,
            res = [],
            i, s, k;

        if (n==3) {
            for (i=0;i<m;i++) {
                res[i] = mat[i][0]*vec[0] + mat[i][1]*vec[1] + mat[i][2]*vec[2];
            }
        } else {
            for (i=0;i<m;i++) {
                s = 0;
                for (k=0;k<n;k++) { s += mat[i][k]*vec[k]; }
                res[i] = s;
            }
        }
        return res;
    },

    /**
     * Initializes a matrix as an array of rows with the given value.
     * @param {Number} n Number of rows
     * @param {Number} m Number of columns
     * @param {Number} [init=0] Initial value for each coefficient
     * @returns {Array} A <tt>n</tt> times <tt>m</tt>-matrix represented by a two-dimensional array. The inner arrays hold the columns, the outer array holds the rows.
     */
    matrix: function(n, m, init) {
        var r, i, j;

        init = init || 0;

        r = new Array(Math.ceil(n));
        for(i=0; i<n; i++) {
            r[i] = new Array(Math.ceil(m));
            for(j=0; j<m; j++) {
                r[i][j] = init;
            }
        }

        return r;
    },

    /**
     * Generates an identity vector or an identity matrix, based on what is given. If n is a number and m is undefined or not a number, a vector is generated,
     * if n and m are both numbers, an identity matrix is generated.
     * @param {Number} n Size of the resulting vector or the number of rows
     * @param {Number} [m] Number of columns
     * @returns {Array} A vector of length <tt>n</tt> with all coefficients equal to 1, if <tt>m</tt> is undefined or not a number
     * or a <tt>n</tt> times <tt>m</tt>-matrix with a_(i,j) = 0 and a_(i,i) = 1 if m is a number.
     */
    identity: function(n, m) {
        var r, i;

        if((m === JXG.undefined) && (typeof m !== 'number')) {
            r = new Array(Math.ceil(n));
            for(i=0; i<n; i++) { r[i] = 1; }
            return r;
        }

        r = JXG.Math.matrix(n, m);
        for(i=0; i<Math.min(n, m); i++) {
            r[i][i] = 1;
        }

        return r;
    },

    /**
     * Computes the product of the two matrices mat1*mat2.
     * @param {Array} mat1 Two dimensional array of numbers
     * @param {Array} mat2 Two dimensional array of numbers
     * @returns {Array} Two dimensional Array of numbers containing result
     */
    matMatMult: function(mat1, mat2) {
        var m = mat1.length,
            n = m>0 ? mat2[0].length : 0,
            m2 = mat2.length,
            res = JXG.Math.matrix(m,n),
            i, j, s, k;

        for (i=0;i<m;i++) {
            for (j=0;j<n;j++) {
                s = 0;
                for (k=0;k<m2;k++) {
                    s += mat1[i][k]*mat2[k][j];
                }
                res[i][j] = s;
            }
        }
        return res;
    },

    /**
     * Transposes a matrix given as a two dimensional array.
     * @param {Array} M The matrix to be transposed
     * @returns {Array} The transpose of M
     */
    matTranspose: function(M) {
        var MT, i, j,
            m, n;

        m = M.length;                     // number of rows of M
        n = M.length>0 ? M[0].length : 0; // number of columns of M
        MT = JXG.Math.matrix(n,m);

        for (i=0; i<n; i++) {
            for (j=0;j<m;j++) {
                MT[i][j] = M[j][i];
            }
        }
        return MT;
    }

};

/**
  * Calculates the crossproducts of two vectors
  * of length three.
  * In case of homogeneous coordinates this is either
  * - the intersection of two lines
  * - the line through two points.
  * @param {Array} c1 homogeneous coordinates of line (point) 1
  * @param {Array} c2 homogeneous coordinates of line (point) 2
  * @type Array
  * @return vector of length 3:  homogeneous coordinates
  *   of the resulting line / point.
  */
JXG.Math.crossProduct = function(c1,c2) {
    return [c1[1]*c2[2]-c1[2]*c2[1],
            c1[2]*c2[0]-c1[0]*c2[2],
            c1[0]*c2[1]-c1[1]*c2[0]];
};

/**
 * Inner product of two vectors a, b. n is the length of the vectors.
 * @param a Vector
 * @param b Vector
 * @param [n] Length of the Vectors. If not given the length of the first vector is taken.
 * @return The inner product of a and b.
 */
JXG.Math.innerProduct = function(a, b, n) {    
    var i, s = 0;
    
    if(typeof n == 'undefined')
        n = a.length;
    
    for (i=0;i<n;i++) {
        s += a[i]*b[i];
    }
    return s;
};



/**
* Dynamic programming approach for recursive functions.
* From "Speed up your JavaScript, Part 3" by Nicholas C. Zakas.
* @see JXG.Math.factorial
* http://blog.thejit.org/2008/09/05/memoization-in-javascript/
*/
JXG.memoizer = function (f) {
    var cache, join;
    
    if (f.memo) {
        return f.memo;
    }
    cache = {};
    join = Array.prototype.join;

    return (f.memo = function() {
        var key = join.call(arguments);
        //return (key in cache)
        return (typeof cache[key]!='undefined') // Seems to be a bit faster than "if (a in b)"
            ? cache[key]
            : cache[key] = f.apply(this, arguments);
    });
};

/**
* Compute the factorial of a positive integer.
* @param {integer n}
* @return {return n*(n-1)...2*1}
*/
JXG.Math.factorial = JXG.memoizer(function (n) {
        if (n<0) return NaN; 
        if (n==0 || n==1) return 1;
        return n*arguments.callee(n-1);
});

/**
* Comupte the binomial coefficient.
* @param {integer n}
* @param {integer k}
* 
* @return {n\choose k}
*/
JXG.Math.binomial = JXG.memoizer(function(n,k) {
    var b, i;
    
    if (k>n || k<0) return 0;
    if (k==0 || k==n) return 1;
    
    b = 1;
    for (i=0;i<k;i++) {
        b *= (n-i);
        b /= (i+1);
    }
    return b;
    //return arguments.callee(n-1,k-1)+arguments.callee(n-1,k);
});

/**
* Round a decimal number to n decimal places
* @deprecated Use (number).toFixed(n) instead.
* @param {float num} Number to round
* @param {integer n} number of digits after the point to leave
* 
* @return {rounded num}
*/
JXG.Math.round = function(num, n) {
    var z, s;
    //return Math.round(num*Math.pow(10,n))/Math.pow(10,n);
    //var z = num.toFixed(n);
    
    z = num - Math.ceil(num);
    s = z.toString();
    if (z < 0) {
        s = s.substr(0,n+3);
    }
    else {
        s = s.substr(0,n+2);
    }
    z = parseFloat(s);
    t = parseInt(num.toString());
    return t+z;
};

/**
 * Cosine hyperbolicus of x.
 * @param {float} x The number the cosine hyperbolicus will be calculated of.
 * @return {float} Cosine hyperbolicus of the given value.
 */
JXG.Math.cosh = function(/** number */ x) /** number */ {
    return (Math.exp(x)+Math.exp(-x))*0.5;
};

/**
 * Sine hyperbolicus of x.
 * @param {number} x The number the sine hyperbolicus will be calculated of.
 * @return {number} Sine hyperbolicus of the given value.
 */
JXG.Math.sinh = function(/** number */ x) /** number */ {
    return (Math.exp(x)-Math.exp(-x))*0.5;
};

/**
 * Compute power a^b
 * @param a Base.
 * @param b Exponent.
 * @return a to the power of b.
 */
JXG.Math.pow = function(/** number */ a, /** number */ b) /** number */ {
    if (a==0) {
        if (b==0) { 
            return 1;
        } else { 
            return 0.0;
        }
    }
    if (Math.floor(b)==b) {// b is integer
        return Math.pow(a,b);
    } else { // b is not integer
        if (a>0) {
            return Math.exp(b*Math.log(Math.abs(a)));
        } else {
            return NaN;
        }
    }
};

/**
  * @private
  *
  * Normalize the stdform [c,b0,b1,a,k,r,q0,q1].
  * @param {Array} stdform to be normalized.
  * @type {Array}
  * @return The normalized stdform.
  */
JXG.Math.normalize = function(stdform) {
    var a2 = 2*stdform[3],
        r = stdform[4]/(a2),  // k/(2a)
        n, signr; 
    stdform[5] = r;
    stdform[6] = -stdform[1]/a2;
    stdform[7] = -stdform[2]/a2;
    if (r==Infinity || isNaN(r)) {
        n = Math.sqrt(stdform[1]*stdform[1]+stdform[2]*stdform[2]);
        stdform[0] /= n;
        stdform[1] /= n;
        stdform[2] /= n;
        stdform[3] = 0;
        stdform[4] = 1;
    } else if (Math.abs(r)>=1) {
        stdform[0] = (stdform[6]*stdform[6]+stdform[7]*stdform[7]-r*r)/(2*r);
        stdform[1] = -stdform[6]/r;
        stdform[2] = -stdform[7]/r;
        stdform[3] = 1/(2*r);
        stdform[4] = 1;
    } else {
        signr = (r<=0)?(-1):(1/*(r==0)?0:1*/);
        stdform[0] = signr*(stdform[6]*stdform[6]+stdform[7]*stdform[7]-r*r)*0.5;
        stdform[1] = -signr*stdform[6];
        stdform[2] = -signr*stdform[7];
        stdform[3] = signr/2;
        stdform[4] = signr*r;
    }
    return stdform;
};
