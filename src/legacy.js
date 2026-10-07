import save from "./legacy-save";
export const attributes = {
        galItems: { type: 'array', default: [] },
        mainImage: { type: 'string', default: '' },
        clntId: { type: 'string', default: '' },
        mainImgWd: { type: 'number', default: 450 },
        mainImgHt: { type: 'number', default: 700 },
        mainImgFinalWd: { type: 'number', default: 450 },
        mainImgFinalHt: { type: 'number', default: 700 },
    };
export default { attributes, supports: { html: false }, save };
