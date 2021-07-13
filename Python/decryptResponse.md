function BBC () {
    var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        e = '',
        n = 0,
        r = [],
        c = function (t) {
            return 32 == n && (n = 0), (t ^= e.charCodeAt(n++)), l(t);
        },
        l = function (t) {
            if (r.length) {
                var e = r[0];
                if (e > 191 && e < 224)
                    return (
                        (r = []),
                        String.fromCharCode(((31 & e) << 6) | (63 & t))
                    );
                if (1 === r.length) return r.push(t), '';
                var n = r[1];
                return (
                    (r = []),
                    String.fromCharCode(
                        ((15 & e) << 12) | ((63 & n) << 6) | (63 & t)
                    )
                );
            }
            return t < 128 ? String.fromCharCode(t) : (r.push(t), '');
        };
    this.decryptResponse = function (input) {
        var r =
            arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 'yaozh_cydn';
        if (!input) return !1;
        (e = 'c0afec76562e9f155d9d2fabd886d9c0'), (n = 0);
        var output = '',
            i = 0;
        for (
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            i < input.length;

        ) {
            var l = t.indexOf(input.charAt(i++)),
                d = t.indexOf(input.charAt(i++)),
                f = t.indexOf(input.charAt(i++)),
                h = t.indexOf(input.charAt(i++)),
                m = (l << 2) | (d >> 4);
            (output += c(m)),
                64 != f && (output += c(((15 & d) << 4) | (f >> 2))),
                64 != h && (output += c(((3 & f) << 6) | h));
        }
        return output;
    };
}

const b = new BBC();

const c = b.decryptResponse(data);