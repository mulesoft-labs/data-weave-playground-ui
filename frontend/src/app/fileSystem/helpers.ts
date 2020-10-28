import {IFile, MediaType, Format, IPathDetails, DataFormat} from 'fileSystem/types';
import crypto = require('crypto');


const DEFAULT_COLOR = '#178bea';


export let SUPPORTED_VERSIONS = [
  "2.1.0",
  "2.2.0",
  "2.2.1",
  "2.2.2",
  "2.3.0",
  "2.4.0"
];


export let DATA_FORMATS: DataFormat[] = [
    {
        mediaType: MediaType.JSON,
        format: Format.JSON,
        color: '#178bea'
    },
    {
        mediaType: MediaType.CSV,
        format: Format.CSV,
        color: '#d1344e'
    },
    {
        mediaType: MediaType.XML,
        format: Format.XML,
        color: '#00b49d'
    },
    {
        mediaType: MediaType.NDJSON,
        format: Format.NDJSON,
        color: '#00b49d'
    },
    {
        mediaType: MediaType.DW,
        format: Format.DW,
        color: '#989a9b'
    },
    {
        mediaType: MediaType.XLSX,
        format: Format.XLSX,
        binary: true,
        color: '#417505'
    },
    {
        mediaType: MediaType.TXT,
        format: Format.TXT,
        color: '#EF7F1A'
    }
    ,
    {
        mediaType: MediaType.MULTIPART,
        format: Format.MULTIPART,
        color: '#B33BBB'
    }
    ,
    {
        mediaType: MediaType.YAML,
        format: Format.YAML,
        color: '#033C0A'
    }
    ,
    {
        mediaType: MediaType.URL_ENCODED,
        format: Format.URL_ENCODED,
        color: '#CFCF2A'
    }
];


let getDataFormatByFormat = function (format: Format) {
    return DATA_FORMATS.find((dataFormat) => {
        return dataFormat.format == format
    });
};
export const getMediaTypeFromFormat = (format: Format): MediaType => {
    if (!format) return null;
    let dataFormat = getDataFormatByFormat(format);
    if (dataFormat) {
        return dataFormat.mediaType;
    } else {
        console.log("[WARN] No Format found for format : ", format);
        return null;
    }
};

export const getMediaTypeFromFileName = (name: String): DataFormat => {
    let extension = getFileExtension(name);
    if(extension != null){
        return DATA_FORMATS.find((df) => "." + df.format.toString() == extension) || DATA_FORMATS[0]
    }
    return DATA_FORMATS[0];
};

export const getFileExtension = (name:String) : String => {
    let number = name.lastIndexOf(".");
    if (number > 0) {
        return name.substr(number);
    }else{
        return null
    }

};

export const toScriptFilePath = function (path: string) {
    if (path.startsWith("/scripts"))
        return path.substring("/scripts".length);
    else
        return path;
};

let getDataFormatByMediaType = function (mediaType: MediaType) {
    return DATA_FORMATS.find((dataFormat) => {
        return dataFormat.mediaType == mediaType
    });
};
export const getFormatFromMediaType = (mediaType: MediaType): Format => {
    if (!mediaType) return null;
    let dataFormat = getDataFormatByMediaType(mediaType);
    if (dataFormat) {
        return dataFormat.format;
    } else {
        console.log("[WARN] No Format found for media type: ", mediaType);
        return null;
    }
};

export const getColorForFormat = (format: Format): string => {
    if (!format) return DEFAULT_COLOR;
    let dataFormat = getDataFormatByFormat(format);
    if (dataFormat && (dataFormat.color != null)) {
        return dataFormat.color;
    } else {
        return DEFAULT_COLOR;
    }
};

export const getFileHash = (definition: IFile) => {
    return crypto.createHash('md5').update(JSON.stringify(definition)).digest('hex');
};

export const isBinary = (mediaType: MediaType): boolean => {
    if (!mediaType) return false;
    let dataFormat = getDataFormatByMediaType(mediaType)
    if (dataFormat && (dataFormat.binary != null)) {
        return dataFormat.binary;
    } else {
        return false;
    }
};

export const getDetailsFromPath = (path: string): IPathDetails => {
    const members = path.split('/');
    const target = members[members.length - 1];
    const splitTarget = target.split('.');
    const name = splitTarget[0];
    const format = (splitTarget[1] as Format) || null;

    return {
        name,
        format, // only for files
        mediaType: getMediaTypeFromFormat(format), // only for files
        location: path.replace(new RegExp(`(?:${name}|\\${name})\\.${format}`), '')
    };
};

export namespace MediaTypeHelpers {

    export const isYaml = (input: string): boolean => {
        const variants = [MediaType.YAML];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isUrlEncoded = (input: string): boolean => {
        const variants = [MediaType.URL_ENCODED];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };
    export const isMultipart = (input: string): boolean => {
        const variants = [MediaType.MULTIPART];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isJson = (input: string): boolean => {
        const variants = [MediaType.JSON, 'text/json'];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isCSV = (input: string): boolean => {
        const variants = [MediaType.CSV, 'text/csv'];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isDW = (input: string): boolean => {
        const variants = ['application/dw', 'text/dw'];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isXML = (input: string): boolean => {
        const variants = [MediaType.XML, 'text/xml'];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isXLSX = (input: string): boolean => {
        const variants = ['application/xlsx'];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isTextPlain = (input: string): boolean => {
        const variants = [MediaType.TXT];
        return variants.some(variant => new RegExp(`^${variant}`).test(input));
    };

    export const isSupportedMediaType = (mediaType: string) => {
        return isJson || isCSV || isDW || isXML || isXLSX || isTextPlain || isMultipart || isYaml || isUrlEncoded;
    };

    export const getSupportedExtensions = () => {
        return DATA_FORMATS.map((dataFormat) => dataFormat.format);
    };

    export const isBinary = (input: string) => {
        return isBinary(input);
    };
}

export const getHash = (subject: string) => {
    return crypto.createHash('md5').update(subject).digest('hex');
};
