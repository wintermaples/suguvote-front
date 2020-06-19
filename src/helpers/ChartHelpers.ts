import { CHART_BG_COLOR_LIGHTNESS, CHART_BG_COLOR_MAIN_SPLIT_NUM, CHART_BG_COLOR_SATURATION } from "@/const/ChartConst";

export class ChartHelpers {

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   {number}  h       The hue
     * @param   {number}  s       The saturation
     * @param   {number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
    private static hslToRgb(h: number, s: number, l: number): string {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return `#${Math.round(r * 255).toString(16)}${Math.round(g * 255).toString(16)}${Math.round(b * 255).toString(16)}`;
    }

    /**
     * 1,2,3,・・・,[CHART_BG_COLOR_MAIN_SPLIT_NUM]が、最も色相が離れるような色を[typeNum]個生成します。
     * [CHART_BG_COLOR_MAIN_SPLIT_NUM]と[CHART_BG_COLOR_MAIN_SPLIT_NUM + 1]の色相は最も近くなります。
     * @param typeNum 色の種類の数
     */
    static generateChartBackgroundColors(typeNum: number): string[] {
        const colors: string[] = [];
        for (let i = 0; i < typeNum; i++) {
            colors.push(ChartHelpers.hslToRgb(Math.min(1, (1.0 / typeNum) * i), CHART_BG_COLOR_SATURATION, CHART_BG_COLOR_LIGHTNESS));
        }

        const colorScheme: string[] = [];
        for (let i = 0; i < Math.ceil(typeNum / CHART_BG_COLOR_MAIN_SPLIT_NUM); i++) {
            const pushedColors: string[] = [];
            for (let j = 0; j < Math.min(colors.length, CHART_BG_COLOR_MAIN_SPLIT_NUM); j++) {
                const color: string = colors[Math.ceil(colors.length / CHART_BG_COLOR_MAIN_SPLIT_NUM) * j];
                colorScheme.push(color);
                pushedColors.push(color);
            }
            pushedColors.forEach(c => colors.splice(colors.indexOf(c), 1));
        }

        return colorScheme;
    }

}
