export default class Utils {
    public static getWalletType(address?: string) {
        if (!address) return null;
        const legacyRegex = /^1[0-9A-Za-z]{25,34}$/;
        const segwitP2SHRegex = /^3[0-9A-Za-z]{25,34}$/;
        const segwitBech32Regex = /^bc1[a-z0-9]{39,59}$/;
        const lightningRegex = /^lnbc[0-9]{1,}[a-z0-9]+$/i;

        if (legacyRegex.test(address)) return "Legacy";
        if (segwitP2SHRegex.test(address)) return "SegWit P2SH";
        if (segwitBech32Regex.test(address)) return "SegWit Bech32 (Native)";
        if (lightningRegex.test(address)) return "Lightning Network";
        return null;
    }

    public static generatePixCode() {
        return Math.random().toString(36).substring(2, 12).toUpperCase();
    }

    public static getBase64Image(base64: string) {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
        return Buffer.from(base64Data, 'base64');
    }
}