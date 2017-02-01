(function () {
    "use strict";

    angular.module('CHM').factory('CommonService', CommonService);

    CommonService.$inject = ['$cordovaSQLite', '$q'];

    function CommonService($cordovaSQLite, $q) {

        var MimeTypes = [{ Extension: ".323", MimeType: "text/h323" },
        { Extension: ".3g2", MimeType: "video/3gpp2" },
        { Extension: ".3gp", MimeType: "video/3gpp" },
        { Extension: ".3gp2", MimeType: "video/3gpp2" },
        { Extension: ".3gpp", MimeType: "video/3gpp" },
        { Extension: ".7z", MimeType: "application/x-7z-compressed" },
        { Extension: ".aa", MimeType: "audio/audible" },
        { Extension: ".AAC", MimeType: "audio/aac" },
        { Extension: ".aaf", MimeType: "application/octet-stream" },
        { Extension: ".aax", MimeType: "audio/vnd.audible.aax" },
        { Extension: ".ac3", MimeType: "audio/ac3" },
        { Extension: ".aca", MimeType: "application/octet-stream" },
        { Extension: ".accda", MimeType: "application/msaccess.addin" },
        { Extension: ".accdb", MimeType: "application/msaccess" },
        { Extension: ".accdc", MimeType: "application/msaccess.cab" },
        { Extension: ".accde", MimeType: "application/msaccess" },
        { Extension: ".accdr", MimeType: "application/msaccess.runtime" },
        { Extension: ".accdt", MimeType: "application/msaccess" },
        { Extension: ".accdw", MimeType: "application/msaccess.webapplication" },
        { Extension: ".accft", MimeType: "application/msaccess.ftemplate" },
        { Extension: ".acx", MimeType: "application/internet-property-stream" },
        { Extension: ".AddIn", MimeType: "text/xml" },
        { Extension: ".ade", MimeType: "application/msaccess" },
        { Extension: ".adobebridge", MimeType: "application/x-bridge-url" },
        { Extension: ".adp", MimeType: "application/msaccess" },
        { Extension: ".ADT", MimeType: "audio/vnd.dlna.adts" },
        { Extension: ".ADTS", MimeType: "audio/aac" },
        { Extension: ".afm", MimeType: "application/octet-stream" },
        { Extension: ".ai", MimeType: "application/postscript" },
        { Extension: ".aif", MimeType: "audio/x-aiff" },
        { Extension: ".aifc", MimeType: "audio/aiff" },
        { Extension: ".aiff", MimeType: "audio/aiff" },
        { Extension: ".air", MimeType: "application/vnd.adobe.air-application-installer-package+zip" },
        { Extension: ".amc", MimeType: "application/x-mpeg" },
        { Extension: ".application", MimeType: "application/x-ms-application" },
        { Extension: ".art", MimeType: "image/x-jg" },
        { Extension: ".asa", MimeType: "application/xml" },
        { Extension: ".asax", MimeType: "application/xml" },
        { Extension: ".ascx", MimeType: "application/xml" },
        { Extension: ".asd", MimeType: "application/octet-stream" },
        { Extension: ".asf", MimeType: "video/x-ms-asf" },
        { Extension: ".ashx", MimeType: "application/xml" },
        { Extension: ".asi", MimeType: "application/octet-stream" },
        { Extension: ".asm", MimeType: "text/plain" },
        { Extension: ".asmx", MimeType: "application/xml" },
        { Extension: ".aspx", MimeType: "application/xml" },
        { Extension: ".asr", MimeType: "video/x-ms-asf" },
        { Extension: ".asx", MimeType: "video/x-ms-asf" },
        { Extension: ".atom", MimeType: "application/atom+xml" },
        { Extension: ".au", MimeType: "audio/basic" },
        { Extension: ".avi", MimeType: "video/x-msvideo" },
        { Extension: ".axs", MimeType: "application/olescript" },
        { Extension: ".bas", MimeType: "text/plain" },
        { Extension: ".bcpio", MimeType: "application/x-bcpio" },
        { Extension: ".bin", MimeType: "application/octet-stream" },
        { Extension: ".bmp", MimeType: "image/bmp" },
        { Extension: ".c", MimeType: "text/plain" },
        { Extension: ".cab", MimeType: "application/octet-stream" },
        { Extension: ".caf", MimeType: "audio/x-caf" },
        { Extension: ".calx", MimeType: "application/vnd.ms-office.calx" },
        { Extension: ".cat", MimeType: "application/vnd.ms-pki.seccat" },
        { Extension: ".cc", MimeType: "text/plain" },
        { Extension: ".cd", MimeType: "text/plain" },
        { Extension: ".cdda", MimeType: "audio/aiff" },
        { Extension: ".cdf", MimeType: "application/x-cdf" },
        { Extension: ".cer", MimeType: "application/x-x509-ca-cert" },
        { Extension: ".chm", MimeType: "application/octet-stream" },
        { Extension: ".class", MimeType: "application/x-java-applet" },
        { Extension: ".clp", MimeType: "application/x-msclip" },
        { Extension: ".cmx", MimeType: "image/x-cmx" },
        { Extension: ".cnf", MimeType: "text/plain" },
        { Extension: ".cod", MimeType: "image/cis-cod" },
        { Extension: ".config", MimeType: "application/xml" },
        { Extension: ".contact", MimeType: "text/x-ms-contact" },
        { Extension: ".coverage", MimeType: "application/xml" },
        { Extension: ".cpio", MimeType: "application/x-cpio" },
        { Extension: ".cpp", MimeType: "text/plain" },
        { Extension: ".crd", MimeType: "application/x-mscardfile" },
        { Extension: ".crl", MimeType: "application/pkix-crl" },
        { Extension: ".crt", MimeType: "application/x-x509-ca-cert" },
        { Extension: ".cs", MimeType: "text/plain" },
        { Extension: ".csdproj", MimeType: "text/plain" },
        { Extension: ".csh", MimeType: "application/x-csh" },
        { Extension: ".csproj", MimeType: "text/plain" },
        { Extension: ".css", MimeType: "text/css" },
        { Extension: ".csv", MimeType: "text/csv" },
        { Extension: ".cur", MimeType: "application/octet-stream" },
        { Extension: ".cxx", MimeType: "text/plain" },
        { Extension: ".dat", MimeType: "application/octet-stream" },
        { Extension: ".datasource", MimeType: "application/xml" },
        { Extension: ".dbproj", MimeType: "text/plain" },
        { Extension: ".dcr", MimeType: "application/x-director" },
        { Extension: ".def", MimeType: "text/plain" },
        { Extension: ".deploy", MimeType: "application/octet-stream" },
        { Extension: ".der", MimeType: "application/x-x509-ca-cert" },
        { Extension: ".dgml", MimeType: "application/xml" },
        { Extension: ".dib", MimeType: "image/bmp" },
        { Extension: ".dif", MimeType: "video/x-dv" },
        { Extension: ".dir", MimeType: "application/x-director" },
        { Extension: ".disco", MimeType: "text/xml" },
        { Extension: ".dll", MimeType: "application/x-msdownload" },
        { Extension: ".dll.config", MimeType: "text/xml" },
        { Extension: ".dlm", MimeType: "text/dlm" },
        { Extension: ".doc", MimeType: "application/msword" },
        { Extension: ".docm", MimeType: "application/vnd.ms-word.document.macroEnabled.12" },
        { Extension: ".docx", MimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { Extension: ".dot", MimeType: "application/msword" },
        { Extension: ".dotm", MimeType: "application/vnd.ms-word.template.macroEnabled.12" },
        { Extension: ".dotx", MimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.template" },
        { Extension: ".dsp", MimeType: "application/octet-stream" },
        { Extension: ".dsw", MimeType: "text/plain" },
        { Extension: ".dtd", MimeType: "text/xml" },
        { Extension: ".dtsConfig", MimeType: "text/xml" },
        { Extension: ".dv", MimeType: "video/x-dv" },
        { Extension: ".dvi", MimeType: "application/x-dvi" },
        { Extension: ".dwf", MimeType: "drawing/x-dwf" },
        { Extension: ".dwp", MimeType: "application/octet-stream" },
        { Extension: ".dxr", MimeType: "application/x-director" },
        { Extension: ".eml", MimeType: "message/rfc822" },
        { Extension: ".emz", MimeType: "application/octet-stream" },
        { Extension: ".eot", MimeType: "application/octet-stream" },
        { Extension: ".eps", MimeType: "application/postscript" },
        { Extension: ".etl", MimeType: "application/etl" },
        { Extension: ".etx", MimeType: "text/x-setext" },
        { Extension: ".evy", MimeType: "application/envoy" },
        { Extension: ".exe", MimeType: "application/octet-stream" },
        { Extension: ".exe.config", MimeType: "text/xml" },
        { Extension: ".fdf", MimeType: "application/vnd.fdf" },
        { Extension: ".fif", MimeType: "application/fractals" },
        { Extension: ".filters", MimeType: "Application/xml" },
        { Extension: ".fla", MimeType: "application/octet-stream" },
        { Extension: ".flr", MimeType: "x-world/x-vrml" },
        { Extension: ".flv", MimeType: "video/x-flv" },
        { Extension: ".fsscript", MimeType: "application/fsharp-script" },
        { Extension: ".fsx", MimeType: "application/fsharp-script" },
        { Extension: ".generictest", MimeType: "application/xml" },
        { Extension: ".gif", MimeType: "image/gif" },
        { Extension: ".group", MimeType: "text/x-ms-group" },
        { Extension: ".gsm", MimeType: "audio/x-gsm" },
        { Extension: ".gtar", MimeType: "application/x-gtar" },
        { Extension: ".gz", MimeType: "application/x-gzip" },
        { Extension: ".h", MimeType: "text/plain" },
        { Extension: ".hdf", MimeType: "application/x-hdf" },
        { Extension: ".hdml", MimeType: "text/x-hdml" },
        { Extension: ".hhc", MimeType: "application/x-oleobject" },
        { Extension: ".hhk", MimeType: "application/octet-stream" },
        { Extension: ".hhp", MimeType: "application/octet-stream" },
        { Extension: ".hlp", MimeType: "application/winhlp" },
        { Extension: ".hpp", MimeType: "text/plain" },
        { Extension: ".hqx", MimeType: "application/mac-binhex40" },
        { Extension: ".hta", MimeType: "application/hta" },
        { Extension: ".htc", MimeType: "text/x-component" },
        { Extension: ".htm", MimeType: "text/html" },
        { Extension: ".html", MimeType: "text/html" },
        { Extension: ".htt", MimeType: "text/webviewhtml" },
        { Extension: ".hxa", MimeType: "application/xml" },
        { Extension: ".hxc", MimeType: "application/xml" },
        { Extension: ".hxd", MimeType: "application/octet-stream" },
        { Extension: ".hxe", MimeType: "application/xml" },
        { Extension: ".hxf", MimeType: "application/xml" },
        { Extension: ".hxh", MimeType: "application/octet-stream" },
        { Extension: ".hxi", MimeType: "application/octet-stream" },
        { Extension: ".hxk", MimeType: "application/xml" },
        { Extension: ".hxq", MimeType: "application/octet-stream" },
        { Extension: ".hxr", MimeType: "application/octet-stream" },
        { Extension: ".hxs", MimeType: "application/octet-stream" },
        { Extension: ".hxt", MimeType: "text/html" },
        { Extension: ".hxv", MimeType: "application/xml" },
        { Extension: ".hxw", MimeType: "application/octet-stream" },
        { Extension: ".hxx", MimeType: "text/plain" },
        { Extension: ".i", MimeType: "text/plain" },
        { Extension: ".ico", MimeType: "image/x-icon" },
        { Extension: ".ics", MimeType: "application/octet-stream" },
        { Extension: ".idl", MimeType: "text/plain" },
        { Extension: ".ief", MimeType: "image/ief" },
        { Extension: ".iii", MimeType: "application/x-iphone" },
        { Extension: ".inc", MimeType: "text/plain" },
        { Extension: ".inf", MimeType: "application/octet-stream" },
        { Extension: ".inl", MimeType: "text/plain" },
        { Extension: ".ins", MimeType: "application/x-internet-signup" },
        { Extension: ".ipa", MimeType: "application/x-itunes-ipa" },
        { Extension: ".ipg", MimeType: "application/x-itunes-ipg" },
        { Extension: ".ipproj", MimeType: "text/plain" },
        { Extension: ".ipsw", MimeType: "application/x-itunes-ipsw" },
        { Extension: ".iqy", MimeType: "text/x-ms-iqy" },
        { Extension: ".isp", MimeType: "application/x-internet-signup" },
        { Extension: ".ite", MimeType: "application/x-itunes-ite" },
        { Extension: ".itlp", MimeType: "application/x-itunes-itlp" },
        { Extension: ".itms", MimeType: "application/x-itunes-itms" },
        { Extension: ".itpc", MimeType: "application/x-itunes-itpc" },
        { Extension: ".IVF", MimeType: "video/x-ivf" },
        { Extension: ".jar", MimeType: "application/java-archive" },
        { Extension: ".java", MimeType: "application/octet-stream" },
        { Extension: ".jck", MimeType: "application/liquidmotion" },
        { Extension: ".jcz", MimeType: "application/liquidmotion" },
        { Extension: ".jfif", MimeType: "image/pjpeg" },
        { Extension: ".jnlp", MimeType: "application/x-java-jnlp-file" },
        { Extension: ".jpb", MimeType: "application/octet-stream" },
        { Extension: ".jpe", MimeType: "image/jpeg" },
        { Extension: ".jpeg", MimeType: "image/jpeg" },
        { Extension: ".jpg", MimeType: "image/jpeg" },
        { Extension: ".js", MimeType: "application/x-javascript" },
        { Extension: ".json", MimeType: "application/json" },
        { Extension: ".jsx", MimeType: "text/jscript" },
        { Extension: ".jsxbin", MimeType: "text/plain" },
        { Extension: ".latex", MimeType: "application/x-latex" },
        { Extension: ".library-ms", MimeType: "application/windows-library+xml" },
        { Extension: ".lit", MimeType: "application/x-ms-reader" },
        { Extension: ".loadtest", MimeType: "application/xml" },
        { Extension: ".lpk", MimeType: "application/octet-stream" },
        { Extension: ".lsf", MimeType: "video/x-la-asf" },
        { Extension: ".lst", MimeType: "text/plain" },
        { Extension: ".lsx", MimeType: "video/x-la-asf" },
        { Extension: ".lzh", MimeType: "application/octet-stream" },
        { Extension: ".m13", MimeType: "application/x-msmediaview" },
        { Extension: ".m14", MimeType: "application/x-msmediaview" },
        { Extension: ".m1v", MimeType: "video/mpeg" },
        { Extension: ".m2t", MimeType: "video/vnd.dlna.mpeg-tts" },
        { Extension: ".m2ts", MimeType: "video/vnd.dlna.mpeg-tts" },
        { Extension: ".m2v", MimeType: "video/mpeg" },
        { Extension: ".m3u", MimeType: "audio/x-mpegurl" },
        { Extension: ".m3u8", MimeType: "audio/x-mpegurl" },
        { Extension: ".m4a", MimeType: "audio/m4a" },
        { Extension: ".m4b", MimeType: "audio/m4b" },
        { Extension: ".m4p", MimeType: "audio/m4p" },
        { Extension: ".m4r", MimeType: "audio/x-m4r" },
        { Extension: ".m4v", MimeType: "video/x-m4v" },
        { Extension: ".mac", MimeType: "image/x-macpaint" },
        { Extension: ".mak", MimeType: "text/plain" },
        { Extension: ".man", MimeType: "application/x-troff-man" },
        { Extension: ".manifest", MimeType: "application/x-ms-manifest" },
        { Extension: ".map", MimeType: "text/plain" },
        { Extension: ".master", MimeType: "application/xml" },
        { Extension: ".mda", MimeType: "application/msaccess" },
        { Extension: ".mdb", MimeType: "application/x-msaccess" },
        { Extension: ".mde", MimeType: "application/msaccess" },
        { Extension: ".mdp", MimeType: "application/octet-stream" },
        { Extension: ".me", MimeType: "application/x-troff-me" },
        { Extension: ".mfp", MimeType: "application/x-shockwave-flash" },
        { Extension: ".mht", MimeType: "message/rfc822" },
        { Extension: ".mhtml", MimeType: "message/rfc822" },
        { Extension: ".mid", MimeType: "audio/mid" },
        { Extension: ".midi", MimeType: "audio/mid" },
        { Extension: ".mix", MimeType: "application/octet-stream" },
        { Extension: ".mk", MimeType: "text/plain" },
        { Extension: ".mmf", MimeType: "application/x-smaf" },
        { Extension: ".mno", MimeType: "text/xml" },
        { Extension: ".mny", MimeType: "application/x-msmoney" },
        { Extension: ".mod", MimeType: "video/mpeg" },
        { Extension: ".mov", MimeType: "video/quicktime" },
        { Extension: ".movie", MimeType: "video/x-sgi-movie" },
        { Extension: ".mp2", MimeType: "video/mpeg" },
        { Extension: ".mp2v", MimeType: "video/mpeg" },
        { Extension: ".mp3", MimeType: "audio/mpeg" },
        { Extension: ".mp4", MimeType: "video/mp4" },
        { Extension: ".mp4v", MimeType: "video/mp4" },
        { Extension: ".mpa", MimeType: "video/mpeg" },
        { Extension: ".mpe", MimeType: "video/mpeg" },
        { Extension: ".mpeg", MimeType: "video/mpeg" },
        { Extension: ".mpf", MimeType: "application/vnd.ms-mediapackage" },
        { Extension: ".mpg", MimeType: "video/mpeg" },
        { Extension: ".mpp", MimeType: "application/vnd.ms-project" },
        { Extension: ".mpv2", MimeType: "video/mpeg" },
        { Extension: ".mqv", MimeType: "video/quicktime" },
        { Extension: ".ms", MimeType: "application/x-troff-ms" },
        { Extension: ".msi", MimeType: "application/octet-stream" },
        { Extension: ".mso", MimeType: "application/octet-stream" },
        { Extension: ".mts", MimeType: "video/vnd.dlna.mpeg-tts" },
        { Extension: ".mtx", MimeType: "application/xml" },
        { Extension: ".mvb", MimeType: "application/x-msmediaview" },
        { Extension: ".mvc", MimeType: "application/x-miva-compiled" },
        { Extension: ".mxp", MimeType: "application/x-mmxp" },
        { Extension: ".nc", MimeType: "application/x-netcdf" },
        { Extension: ".nsc", MimeType: "video/x-ms-asf" },
        { Extension: ".nws", MimeType: "message/rfc822" },
        { Extension: ".ocx", MimeType: "application/octet-stream" },
        { Extension: ".oda", MimeType: "application/oda" },
        { Extension: ".odc", MimeType: "text/x-ms-odc" },
        { Extension: ".odh", MimeType: "text/plain" },
        { Extension: ".odl", MimeType: "text/plain" },
        { Extension: ".odp", MimeType: "application/vnd.oasis.opendocument.presentation" },
        { Extension: ".ods", MimeType: "application/oleobject" },
        { Extension: ".odt", MimeType: "application/vnd.oasis.opendocument.text" },
        { Extension: ".one", MimeType: "application/onenote" },
        { Extension: ".onea", MimeType: "application/onenote" },
        { Extension: ".onepkg", MimeType: "application/onenote" },
        { Extension: ".onetmp", MimeType: "application/onenote" },
        { Extension: ".onetoc", MimeType: "application/onenote" },
        { Extension: ".onetoc2", MimeType: "application/onenote" },
        { Extension: ".orderedtest", MimeType: "application/xml" },
        { Extension: ".osdx", MimeType: "application/opensearchdescription+xml" },
        { Extension: ".p10", MimeType: "application/pkcs10" },
        { Extension: ".p12", MimeType: "application/x-pkcs12" },
        { Extension: ".p7b", MimeType: "application/x-pkcs7-certificates" },
        { Extension: ".p7c", MimeType: "application/pkcs7-mime" },
        { Extension: ".p7m", MimeType: "application/pkcs7-mime" },
        { Extension: ".p7r", MimeType: "application/x-pkcs7-certreqresp" },
        { Extension: ".p7s", MimeType: "application/pkcs7-signature" },
        { Extension: ".pbm", MimeType: "image/x-portable-bitmap" },
        { Extension: ".pcast", MimeType: "application/x-podcast" },
        { Extension: ".pct", MimeType: "image/pict" },
        { Extension: ".pcx", MimeType: "application/octet-stream" },
        { Extension: ".pcz", MimeType: "application/octet-stream" },
        { Extension: ".pdf", MimeType: "application/pdf" },
        { Extension: ".pfb", MimeType: "application/octet-stream" },
        { Extension: ".pfm", MimeType: "application/octet-stream" },
        { Extension: ".pfx", MimeType: "application/x-pkcs12" },
        { Extension: ".pgm", MimeType: "image/x-portable-graymap" },
        { Extension: ".pic", MimeType: "image/pict" },
        { Extension: ".pict", MimeType: "image/pict" },
        { Extension: ".pkgdef", MimeType: "text/plain" },
        { Extension: ".pkgundef", MimeType: "text/plain" },
        { Extension: ".pko", MimeType: "application/vnd.ms-pki.pko" },
        { Extension: ".pls", MimeType: "audio/scpls" },
        { Extension: ".pma", MimeType: "application/x-perfmon" },
        { Extension: ".pmc", MimeType: "application/x-perfmon" },
        { Extension: ".pml", MimeType: "application/x-perfmon" },
        { Extension: ".pmr", MimeType: "application/x-perfmon" },
        { Extension: ".pmw", MimeType: "application/x-perfmon" },
        { Extension: ".png", MimeType: "image/png" },
        { Extension: ".pnm", MimeType: "image/x-portable-anymap" },
        { Extension: ".pnt", MimeType: "image/x-macpaint" },
        { Extension: ".pntg", MimeType: "image/x-macpaint" },
        { Extension: ".pnz", MimeType: "image/png" },
        { Extension: ".pot", MimeType: "application/vnd.ms-powerpoint" },
        { Extension: ".potm", MimeType: "application/vnd.ms-powerpoint.template.macroEnabled.12" },
        { Extension: ".potx", MimeType: "application/vnd.openxmlformats-officedocument.presentationml.template" },
        { Extension: ".ppa", MimeType: "application/vnd.ms-powerpoint" },
        { Extension: ".ppam", MimeType: "application/vnd.ms-powerpoint.addin.macroEnabled.12" },
        { Extension: ".ppm", MimeType: "image/x-portable-pixmap" },
        { Extension: ".pps", MimeType: "application/vnd.ms-powerpoint" },
        { Extension: ".ppsm", MimeType: "application/vnd.ms-powerpoint.slideshow.macroEnabled.12" },
        { Extension: ".ppsx", MimeType: "application/vnd.openxmlformats-officedocument.presentationml.slideshow" },
        { Extension: ".ppt", MimeType: "application/vnd.ms-powerpoint" },
        { Extension: ".pptm", MimeType: "application/vnd.ms-powerpoint.presentation.macroEnabled.12" },
        { Extension: ".pptx", MimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
        { Extension: ".prf", MimeType: "application/pics-rules" },
        { Extension: ".prm", MimeType: "application/octet-stream" },
        { Extension: ".prx", MimeType: "application/octet-stream" },
        { Extension: ".ps", MimeType: "application/postscript" },
        { Extension: ".psc1", MimeType: "application/PowerShell" },
        { Extension: ".psd", MimeType: "application/octet-stream" },
        { Extension: ".psess", MimeType: "application/xml" },
        { Extension: ".psm", MimeType: "application/octet-stream" },
        { Extension: ".psp", MimeType: "application/octet-stream" },
        { Extension: ".pub", MimeType: "application/x-mspublisher" },
        { Extension: ".pwz", MimeType: "application/vnd.ms-powerpoint" },
        { Extension: ".qht", MimeType: "text/x-html-insertion" },
        { Extension: ".qhtm", MimeType: "text/x-html-insertion" },
        { Extension: ".qt", MimeType: "video/quicktime" },
        { Extension: ".qti", MimeType: "image/x-quicktime" },
        { Extension: ".qtif", MimeType: "image/x-quicktime" },
        { Extension: ".qtl", MimeType: "application/x-quicktimeplayer" },
        { Extension: ".qxd", MimeType: "application/octet-stream" },
        { Extension: ".ra", MimeType: "audio/x-pn-realaudio" },
        { Extension: ".ram", MimeType: "audio/x-pn-realaudio" },
        { Extension: ".rar", MimeType: "application/octet-stream" },
        { Extension: ".ras", MimeType: "image/x-cmu-raster" },
        { Extension: ".rat", MimeType: "application/rat-file" },
        { Extension: ".rc", MimeType: "text/plain" },
        { Extension: ".rc2", MimeType: "text/plain" },
        { Extension: ".rct", MimeType: "text/plain" },
        { Extension: ".rdlc", MimeType: "application/xml" },
        { Extension: ".resx", MimeType: "application/xml" },
        { Extension: ".rf", MimeType: "image/vnd.rn-realflash" },
        { Extension: ".rgb", MimeType: "image/x-rgb" },
        { Extension: ".rgs", MimeType: "text/plain" },
        { Extension: ".rm", MimeType: "application/vnd.rn-realmedia" },
        { Extension: ".rmi", MimeType: "audio/mid" },
        { Extension: ".rmp", MimeType: "application/vnd.rn-rn_music_package" },
        { Extension: ".roff", MimeType: "application/x-troff" },
        { Extension: ".rpm", MimeType: "audio/x-pn-realaudio-plugin" },
        { Extension: ".rqy", MimeType: "text/x-ms-rqy" },
        { Extension: ".rtf", MimeType: "application/rtf" },
        { Extension: ".rtx", MimeType: "text/richtext" },
        { Extension: ".ruleset", MimeType: "application/xml" },
        { Extension: ".s", MimeType: "text/plain" },
        { Extension: ".safariextz", MimeType: "application/x-safari-safariextz" },
        { Extension: ".scd", MimeType: "application/x-msschedule" },
        { Extension: ".sct", MimeType: "text/scriptlet" },
        { Extension: ".sd2", MimeType: "audio/x-sd2" },
        { Extension: ".sdp", MimeType: "application/sdp" },
        { Extension: ".sea", MimeType: "application/octet-stream" },
        { Extension: ".searchConnector-ms", MimeType: "application/windows-search-connector+xml" },
        { Extension: ".setpay", MimeType: "application/set-payment-initiation" },
        { Extension: ".setreg", MimeType: "application/set-registration-initiation" },
        { Extension: ".settings", MimeType: "application/xml" },
        { Extension: ".sgimb", MimeType: "application/x-sgimb" },
        { Extension: ".sgml", MimeType: "text/sgml" },
        { Extension: ".sh", MimeType: "application/x-sh" },
        { Extension: ".shar", MimeType: "application/x-shar" },
        { Extension: ".shtml", MimeType: "text/html" },
        { Extension: ".sit", MimeType: "application/x-stuffit" },
        { Extension: ".sitemap", MimeType: "application/xml" },
        { Extension: ".skin", MimeType: "application/xml" },
        { Extension: ".sldm", MimeType: "application/vnd.ms-powerpoint.slide.macroEnabled.12" },
        { Extension: ".sldx", MimeType: "application/vnd.openxmlformats-officedocument.presentationml.slide" },
        { Extension: ".slk", MimeType: "application/vnd.ms-excel" },
        { Extension: ".sln", MimeType: "text/plain" },
        { Extension: ".slupkg-ms", MimeType: "application/x-ms-license" },
        { Extension: ".smd", MimeType: "audio/x-smd" },
        { Extension: ".smi", MimeType: "application/octet-stream" },
        { Extension: ".smx", MimeType: "audio/x-smd" },
        { Extension: ".smz", MimeType: "audio/x-smd" },
        { Extension: ".snd", MimeType: "audio/basic" },
        { Extension: ".snippet", MimeType: "application/xml" },
        { Extension: ".snp", MimeType: "application/octet-stream" },
        { Extension: ".sol", MimeType: "text/plain" },
        { Extension: ".sor", MimeType: "text/plain" },
        { Extension: ".spc", MimeType: "application/x-pkcs7-certificates" },
        { Extension: ".spl", MimeType: "application/futuresplash" },
        { Extension: ".src", MimeType: "application/x-wais-source" },
        { Extension: ".srf", MimeType: "text/plain" },
        { Extension: ".SSISDeploymentManifest", MimeType: "text/xml" },
        { Extension: ".ssm", MimeType: "application/streamingmedia" },
        { Extension: ".sst", MimeType: "application/vnd.ms-pki.certstore" },
        { Extension: ".stl", MimeType: "application/vnd.ms-pki.stl" },
        { Extension: ".sv4cpio", MimeType: "application/x-sv4cpio" },
        { Extension: ".sv4crc", MimeType: "application/x-sv4crc" },
        { Extension: ".svc", MimeType: "application/xml" },
        { Extension: ".swf", MimeType: "application/x-shockwave-flash" },
        { Extension: ".t", MimeType: "application/x-troff" },
        { Extension: ".tar", MimeType: "application/x-tar" },
        { Extension: ".tcl", MimeType: "application/x-tcl" },
        { Extension: ".testrunconfig", MimeType: "application/xml" },
        { Extension: ".testsettings", MimeType: "application/xml" },
        { Extension: ".tex", MimeType: "application/x-tex" },
        { Extension: ".texi", MimeType: "application/x-texinfo" },
        { Extension: ".texinfo", MimeType: "application/x-texinfo" },
        { Extension: ".tgz", MimeType: "application/x-compressed" },
        { Extension: ".thmx", MimeType: "application/vnd.ms-officetheme" },
        { Extension: ".thn", MimeType: "application/octet-stream" },
        { Extension: ".tif", MimeType: "image/tiff" },
        { Extension: ".tiff", MimeType: "image/tiff" },
        { Extension: ".tlh", MimeType: "text/plain" },
        { Extension: ".tli", MimeType: "text/plain" },
        { Extension: ".toc", MimeType: "application/octet-stream" },
        { Extension: ".tr", MimeType: "application/x-troff" },
        { Extension: ".trm", MimeType: "application/x-msterminal" },
        { Extension: ".trx", MimeType: "application/xml" },
        { Extension: ".ts", MimeType: "video/vnd.dlna.mpeg-tts" },
        { Extension: ".tsv", MimeType: "text/tab-separated-values" },
        { Extension: ".ttf", MimeType: "application/octet-stream" },
        { Extension: ".tts", MimeType: "video/vnd.dlna.mpeg-tts" },
        { Extension: ".txt", MimeType: "text/plain" },
        { Extension: ".u32", MimeType: "application/octet-stream" },
        { Extension: ".uls", MimeType: "text/iuls" },
        { Extension: ".user", MimeType: "text/plain" },
        { Extension: ".ustar", MimeType: "application/x-ustar" },
        { Extension: ".vb", MimeType: "text/plain" },
        { Extension: ".vbdproj", MimeType: "text/plain" },
        { Extension: ".vbk", MimeType: "video/mpeg" },
        { Extension: ".vbproj", MimeType: "text/plain" },
        { Extension: ".vbs", MimeType: "text/vbscript" },
        { Extension: ".vcf", MimeType: "text/x-vcard" },
        { Extension: ".vcproj", MimeType: "Application/xml" },
        { Extension: ".vcs", MimeType: "text/plain" },
        { Extension: ".vcxproj", MimeType: "Application/xml" },
        { Extension: ".vddproj", MimeType: "text/plain" },
        { Extension: ".vdp", MimeType: "text/plain" },
        { Extension: ".vdproj", MimeType: "text/plain" },
        { Extension: ".vdx", MimeType: "application/vnd.ms-visio.viewer" },
        { Extension: ".vml", MimeType: "text/xml" },
        { Extension: ".vscontent", MimeType: "application/xml" },
        { Extension: ".vsct", MimeType: "text/xml" },
        { Extension: ".vsd", MimeType: "application/vnd.visio" },
        { Extension: ".vsi", MimeType: "application/ms-vsi" },
        { Extension: ".vsix", MimeType: "application/vsix" },
        { Extension: ".vsixlangpack", MimeType: "text/xml" },
        { Extension: ".vsixmanifest", MimeType: "text/xml" },
        { Extension: ".vsmdi", MimeType: "application/xml" },
        { Extension: ".vspscc", MimeType: "text/plain" },
        { Extension: ".vss", MimeType: "application/vnd.visio" },
        { Extension: ".vsscc", MimeType: "text/plain" },
        { Extension: ".vssettings", MimeType: "text/xml" },
        { Extension: ".vssscc", MimeType: "text/plain" },
        { Extension: ".vst", MimeType: "application/vnd.visio" },
        { Extension: ".vstemplate", MimeType: "text/xml" },
        { Extension: ".vsto", MimeType: "application/x-ms-vsto" },
        { Extension: ".vsw", MimeType: "application/vnd.visio" },
        { Extension: ".vsx", MimeType: "application/vnd.visio" },
        { Extension: ".vtx", MimeType: "application/vnd.visio" },
        { Extension: ".wav", MimeType: "audio/wav" },
        { Extension: ".wave", MimeType: "audio/wav" },
        { Extension: ".wax", MimeType: "audio/x-ms-wax" },
        { Extension: ".wbk", MimeType: "application/msword" },
        { Extension: ".wbmp", MimeType: "image/vnd.wap.wbmp" },
        { Extension: ".wcm", MimeType: "application/vnd.ms-works" },
        { Extension: ".wdb", MimeType: "application/vnd.ms-works" },
        { Extension: ".wdp", MimeType: "image/vnd.ms-photo" },
        { Extension: ".webarchive", MimeType: "application/x-safari-webarchive" },
        { Extension: ".webtest", MimeType: "application/xml" },
        { Extension: ".wiq", MimeType: "application/xml" },
        { Extension: ".wiz", MimeType: "application/msword" },
        { Extension: ".wks", MimeType: "application/vnd.ms-works" },
        { Extension: ".WLMP", MimeType: "application/wlmoviemaker" },
        { Extension: ".wlpginstall", MimeType: "application/x-wlpg-detect" },
        { Extension: ".wlpginstall3", MimeType: "application/x-wlpg3-detect" },
        { Extension: ".wm", MimeType: "video/x-ms-wm" },
        { Extension: ".wma", MimeType: "audio/x-ms-wma" },
        { Extension: ".wmd", MimeType: "application/x-ms-wmd" },
        { Extension: ".wmf", MimeType: "application/x-msmetafile" },
        { Extension: ".wml", MimeType: "text/vnd.wap.wml" },
        { Extension: ".wmlc", MimeType: "application/vnd.wap.wmlc" },
        { Extension: ".wmls", MimeType: "text/vnd.wap.wmlscript" },
        { Extension: ".wmlsc", MimeType: "application/vnd.wap.wmlscriptc" },
        { Extension: ".wmp", MimeType: "video/x-ms-wmp" },
        { Extension: ".wmv", MimeType: "video/x-ms-wmv" },
        { Extension: ".wmx", MimeType: "video/x-ms-wmx" },
        { Extension: ".wmz", MimeType: "application/x-ms-wmz" },
        { Extension: ".wpl", MimeType: "application/vnd.ms-wpl" },
        { Extension: ".wps", MimeType: "application/vnd.ms-works" },
        { Extension: ".wri", MimeType: "application/x-mswrite" },
        { Extension: ".wrl", MimeType: "x-world/x-vrml" },
        { Extension: ".wrz", MimeType: "x-world/x-vrml" },
        { Extension: ".wsc", MimeType: "text/scriptlet" },
        { Extension: ".wsdl", MimeType: "text/xml" },
        { Extension: ".wvx", MimeType: "video/x-ms-wvx" },
        { Extension: ".x", MimeType: "application/directx" },
        { Extension: ".xaf", MimeType: "x-world/x-vrml" },
        { Extension: ".xaml", MimeType: "application/xaml+xml" },
        { Extension: ".xap", MimeType: "application/x-silverlight-app" },
        { Extension: ".xbap", MimeType: "application/x-ms-xbap" },
        { Extension: ".xbm", MimeType: "image/x-xbitmap" },
        { Extension: ".xdr", MimeType: "text/plain" },
        { Extension: ".xht", MimeType: "application/xhtml+xml" },
        { Extension: ".xhtml", MimeType: "application/xhtml+xml" },
        { Extension: ".xla", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xlam", MimeType: "application/vnd.ms-excel.addin.macroEnabled.12" },
        { Extension: ".xlc", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xld", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xlk", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xll", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xlm", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xls", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xlsb", MimeType: "application/vnd.ms-excel.sheet.binary.macroEnabled.12" },
        { Extension: ".xlsm", MimeType: "application/vnd.ms-excel.sheet.macroEnabled.12" },
        { Extension: ".xlsx", MimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
        { Extension: ".xlt", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xltm", MimeType: "application/vnd.ms-excel.template.macroEnabled.12" },
        { Extension: ".xltx", MimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.template" },
        { Extension: ".xlw", MimeType: "application/vnd.ms-excel" },
        { Extension: ".xml", MimeType: "text/xml" },
        { Extension: ".xmta", MimeType: "application/xml" },
        { Extension: ".xof", MimeType: "x-world/x-vrml" },
        { Extension: ".XOML", MimeType: "text/plain" },
        { Extension: ".xpm", MimeType: "image/x-xpixmap" },
        { Extension: ".xps", MimeType: "application/vnd.ms-xpsdocument" },
        { Extension: ".xrm-ms", MimeType: "text/xml" },
        { Extension: ".xsc", MimeType: "application/xml" },
        { Extension: ".xsd", MimeType: "text/xml" },
        { Extension: ".xsf", MimeType: "text/xml" },
        { Extension: ".xsl", MimeType: "text/xml" },
        { Extension: ".xslt", MimeType: "text/xml" },
        { Extension: ".xsn", MimeType: "application/octet-stream" },
        { Extension: ".xss", MimeType: "application/xml" },
        { Extension: ".xtp", MimeType: "application/octet-stream" },
        { Extension: ".xwd", MimeType: "image/x-xwindowdump" },
        { Extension: ".z", MimeType: "application/x-compress" },
        { Extension: ".zip", MimeType: "application/x-zip-compressed" }];

        var objCommonService = {};

        objCommonService.base64toBlob = base64toBlob;
        objCommonService.getMimeTypeForExtension = getMimeTypeForExtension;

        //----------------------Select--------------------------
        objCommonService.SelectAllLoginRecords = SelectAllLoginRecords;
        objCommonService.SelectResidentAnswerDocuments = SelectResidentAnswerDocuments;
        objCommonService.SelectAllResidents = SelectAllResidents;
        objCommonService.SelectAllSectionQuestions = SelectAllSectionQuestions;
        objCommonService.SelectAllResidentPhotos = SelectAllResidentPhotos;
        objCommonService.SelectAllUsersOrganizations = SelectAllUsersOrganizations;
        objCommonService.SelectConfigurationValues = SelectConfigurationValues;
        objCommonService.SelectAllQuestionParentQuestions = SelectAllQuestionParentQuestions;
        objCommonService.SelectAllActiveSections = SelectAllActiveSections;
        objCommonService.SelectAllSectionsQuestionsAnswers = SelectAllSectionsQuestionsAnswers;
        objCommonService.SelectAllResidentsQuestionsAnswers = SelectAllResidentsQuestionsAnswers;
        objCommonService.SelectAllResidentAnswerDocuments = SelectAllResidentAnswerDocuments;


        //----------------------Delete--------------------------
        objCommonService.DeleteAllLoginRecords = DeleteAllLoginRecords;
        objCommonService.DeleteAllResidentDependableTables = DeleteAllResidentDependableTables;
        objCommonService.UpdateDeletedPainMonitoring = UpdateDeletedPainMonitoring;
        objCommonService.DeleteAllResidentRecords = DeleteAllResidentRecords;
        objCommonService.DeleteAllActionRecords = DeleteAllActionRecords;
        objCommonService.DeleteAllAction_DaysRecords = DeleteAllAction_DaysRecords;
        objCommonService.DeleteAllInterventionsRecords = DeleteAllInterventionsRecords;
        objCommonService.DeleteAllActionAction_DaysInterventionsRecords = DeleteAllActionAction_DaysInterventionsRecords;
        objCommonService.DeleteAllInterventions_Resident_AnswersRecords = DeleteAllInterventions_Resident_AnswersRecords;
        objCommonService.DeleteAllResident_Interventions_Questions_AnswersRecords = DeleteAllResident_Interventions_Questions_AnswersRecords;
        objCommonService.DeleteAllResidents_Questions_AnswersRecords = DeleteAllResidents_Questions_AnswersRecords;
        objCommonService.DeleteResidentPhotos = DeleteResidentPhotos;
        objCommonService.DeleteAllInterventionResidentAnswerDocuments = DeleteAllInterventionResidentAnswerDocuments;
        objCommonService.DeleteAllResidentAnswerDocuments = DeleteAllResidentAnswerDocuments;
        objCommonService.DeleteInterventionResidentAnswerDocuments = DeleteInterventionResidentAnswerDocuments;
        objCommonService.DeleteResidentAnswerDocuments = DeleteResidentAnswerDocuments;
        objCommonService.DeleteOfflineAdhocInterventions = DeleteOfflineAdhocInterventions;
        objCommonService.DeleteAllResidentAdhocIntervention = DeleteAllResidentAdhocIntervention;






        //--------------------------Update---------------------------
        objCommonService.UpdateAcceptAsResident = UpdateAcceptAsResident;
        objCommonService.UpdateInterventionsStatus = UpdateInterventionsStatus;
        objCommonService.UpdateInterventions_Resident_AnswersIsActive = UpdateInterventions_Resident_AnswersIsActive;
        objCommonService.UpdateResidents_Questions_Answers = UpdateResidents_Questions_Answers;
        objCommonService.UpdateResident_Interventions_Questions_Answers = UpdateResident_Interventions_Questions_Answers;
        objCommonService.UpdateResidents = UpdateResidents;
        objCommonService.UploadPhoto_Offline = UploadPhoto_Offline;
        objCommonService.UpdateExistingResidents_Questions_Answers = UpdateExistingResidents_Questions_Answers;
        objCommonService.UpdateOfflineActionAdhocInterventions = UpdateOfflineActionAdhocInterventions;
        objCommonService.UpdateOfflineActionDaysAdhocInterventions = UpdateOfflineActionDaysAdhocInterventions;
        objCommonService.UpdateOfflineInterventionsAdhocInterventions = UpdateOfflineInterventionsAdhocInterventions;
        objCommonService.UpdateInterventions = UpdateInterventions;
        objCommonService.UpdateInterventions_Resident_Answers = UpdateInterventions_Resident_Answers;
        objCommonService.UpdateResidentAnswerDocuments = UpdateResidentAnswerDocuments;
        objCommonService.UpdateinsertResidentPhotos = UpdateinsertResidentPhotos;
        objCommonService.UpdatePainMonitoring = UpdatePainMonitoring;
        objCommonService.UpdateResidentsBasedonID = UpdateResidentsBasedonID;
        objCommonService.DeleteOfflineResidentData = DeleteOfflineResidentData;
        objCommonService.UpdateLogin = UpdateLogin;
        // objCommonService.UpdateAdminSync = UpdateAdminSync;

        //--------------------------Insert---------------------------
        objCommonService.InsertLogin = InsertLogin;
        objCommonService.insertOfflineResidents = insertOfflineResidents;
        objCommonService.insertOfflinePainMonitoring = insertOfflinePainMonitoring;
        objCommonService.insertOfflineResidentPhotos = insertOfflineResidentPhotos;
        objCommonService.insertResidentsQAsDocuments = insertResidentsQAsDocuments;
        objCommonService.insertInterventionResidentQAsDocuments = insertInterventionResidentQAsDocuments;
        objCommonService.insertResidentAdhocInterventionDocuments = insertResidentAdhocInterventionDocuments;

        //--------------------------BulkInsert-----------------


        objCommonService.insertActions = insertActions;
        objCommonService.insertActions_Days = insertActions_Days;
        objCommonService.insertIntervention_Question = insertIntervention_Question;
        objCommonService.insertIntervention_Question_Answer = insertIntervention_Question_Answer;
        objCommonService.insertIntervention_Question_Answer_Task = insertIntervention_Question_Answer_Task;
        objCommonService.insertIntervention_Question_ParentQuestion = insertIntervention_Question_ParentQuestion;
        objCommonService.insertInterventions = insertInterventions;
        objCommonService.insertInterventions_Question_Answer_Summary = insertInterventions_Question_Answer_Summary;
        objCommonService.insertInterventions_Resident_Answers = insertInterventions_Resident_Answers;
        objCommonService.insertOrganizationGroups = insertOrganizationGroups;
        objCommonService.insertOrganizationGroups_Organizations = insertOrganizationGroups_Organizations;
        objCommonService.insertOrganizations = insertOrganizations;
        objCommonService.insertQuestionParentQuestion = insertQuestionParentQuestion;
        objCommonService.insertResident_Interventions_Questions_Answers = insertResident_Interventions_Questions_Answers;
        objCommonService.insertResidents = insertResidents;
        objCommonService.insertResidents_Questions_Answers = insertResidents_Questions_Answers;
        objCommonService.insertResidents_Relatives = insertResidents_Relatives;
        objCommonService.insertRolesService = insertRolesService;
        objCommonService.insertSection_Intervention = insertSection_Intervention;
        objCommonService.insertSection_Intervention_Statements = insertSection_Intervention_Statements;
        objCommonService.insertSection_Summary = insertSection_Summary;
        objCommonService.insertSections = insertSections;
        objCommonService.insertSections_Organizations = insertSections_Organizations;
        objCommonService.insertSectionsQuestions = insertSectionsQuestions;
        objCommonService.insertSections_Questions_Answers = insertSections_Questions_Answers;
        objCommonService.insertSections_Questions_Answers_Summary = insertSections_Questions_Answers_Summary;
        objCommonService.insertSections_Questions_Answers_Tasks = insertSections_Questions_Answers_Tasks;
        objCommonService.insertSections_Questions_Answers_Widget = insertSections_Questions_Answers_Widget;
        objCommonService.insertUsers = insertUsers;
        objCommonService.insertUsers_Organizations = insertUsers_Organizations;
        objCommonService.insertUser_Roles = insertUser_Roles;
        objCommonService.insertInterventionResidentAnswerDocuments = insertInterventionResidentAnswerDocuments;
        objCommonService.insertResidentAnswerDocuments = insertResidentAnswerDocuments;
        objCommonService.insertResidentPhotos = insertResidentPhotos;
        objCommonService.insertUser_Types = insertUser_Types;
        objCommonService.insertPainMonitoring = insertPainMonitoring;
        objCommonService.insertConfigurations = insertConfigurations;



        return objCommonService;

        function SelectAllResidents(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Residents");
        }
        function SelectAllSectionQuestions(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Sections_Questions");
        }
        function SelectAllResidentPhotos(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM ResidentPhotos");
        }
        function SelectAllUsersOrganizations(db, userid) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Users_Organizations where UserID=?", [userid]);
        }
        function SelectConfigurationValues(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Configurations");
        }
        function SelectAllQuestionParentQuestions(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Question_ParentQuestion");
        }
        function SelectAllActiveSections(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Sections where IsActive=? and HasSummary=?", [true, true]);
        }
        function SelectAllSectionsQuestionsAnswers(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Sections_Questions_Answers");
        }
        function SelectAllResidentsQuestionsAnswers(db, residentID) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Residents_Questions_Answers where ResidentID=? and IsActive=?", [residentID, true]);
        }
        function SelectAllResidentAnswerDocuments(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM ResidentAnswerDocuments where IsActive=?", [true]);
        }


        function base64toBlob(base64Data, contentType) {
            contentType = contentType || '';
            var sliceSize = 1024;
            var byteCharacters = atob(base64Data);
            var bytesLength = byteCharacters.length;
            var slicesCount = Math.ceil(bytesLength / sliceSize);
            var byteArrays = new Array(slicesCount);

            for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
                var begin = sliceIndex * sliceSize;
                var end = Math.min(begin + sliceSize, bytesLength);

                var bytes = new Array(end - begin);
                for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                    bytes[i] = byteCharacters[offset].charCodeAt(0);
                }
                byteArrays[sliceIndex] = new Uint8Array(bytes);
            }
            return new Blob(byteArrays, { type: contentType });
        }

        function getMimeTypeForExtension(extension) {
            var mimeType = 'text/plain';
            for (var i = 0; i < MimeTypes.length; i++) {
                if (MimeTypes[i].Extension == extension) {
                    mimeType = MimeTypes[i].MimeType;
                    break;
                }
            }
            return mimeType;
        };

        function SelectAllLoginRecords(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Login");
        }
        function SelectResidentAnswerDocuments(db) {
            return $cordovaSQLite.execute(db, "SELECT * FROM ResidentAnswerDocuments");
        }
        function DeleteAllResidentDependableTables(db) {
            $cordovaSQLite.execute(db, "DELETE FROM Residents");
            $cordovaSQLite.execute(db, "DELETE FROM Actions");
            $cordovaSQLite.execute(db, "DELETE FROM Actions_Days");
            $cordovaSQLite.execute(db, "DELETE FROM Interventions");
            $cordovaSQLite.execute(db, "DELETE FROM Interventions_Resident_Answers");
            $cordovaSQLite.execute(db, "DELETE FROM Resident_Interventions_Questions_Answers");
            $cordovaSQLite.execute(db, "DELETE FROM Residents_Questions_Answers");
            $cordovaSQLite.execute(db, "DELETE FROM ResidentPhotos");
            $cordovaSQLite.execute(db, "DELETE FROM InterventionResidentAnswerDocuments");
            $cordovaSQLite.execute(db, "DELETE FROM ResidentAnswerDocuments");
            $cordovaSQLite.execute(db, "DELETE FROM ResidentAdhocInterventionDocuments");
            return $cordovaSQLite.execute(db, "DELETE FROM PainMonitoring");
        }




        function DeleteOfflineResidentData(db, t) {
            var q = $q.defer();
            UpdateResidentsBasedonID(db, t).then(function () {
                $cordovaSQLite.execute(db, "UPDATE  Actions SET IsActive = ?, IsSyncnised= ?,IsCreated=? WHERE ResidentID = ?", [false, false, false, t.ID]);
                $cordovaSQLite.execute(db, "UPDATE  Interventions_Resident_Answers SET IsActive = ?, IsSyncnised= ?,IsCreated=? WHERE ResidentID = ?", [false, false, false, t.ID]);
                $cordovaSQLite.execute(db, "UPDATE  Resident_Interventions_Questions_Answers SET IsActive = ?, IsSyncnised= ? ,IsCreated=? WHERE ResidentID = ?", [false, false, false, t.ID]);
                $cordovaSQLite.execute(db, "UPDATE  Residents_Questions_Answers SET IsActive = ?, IsSyncnised= ? ,IsCreated=? WHERE ResidentID = ?", [false, false, false, t.ID]);
                $cordovaSQLite.execute(db, "UPDATE  Residents_Relatives SET IsActive = ?, IsSyncnised= ? ,IsCreated=? WHERE ResidentID = ?", [false, false, false, t.ID]);
                $cordovaSQLite.execute(db, "UPDATE  PainMonitoring SET IsActive = ?, IsSyncnised= ?,IsCreated=? WHERE ResidentID = ?", [false, false, false, t.ID]);
                q.resolve();
            });
            return q.promise;
        }

        function UpdateResidentsBasedonID(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Residents SET IsActive = ?, IsSyncnised= ?,IsCreated=? WHERE ID = ?", [false, false, false, t.ID]);
        }

        function UpdateDeletedPainMonitoring(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  PainMonitoring SET IsActive = ?, IsSyncnised= ?,IsCreated=? WHERE ID = ?", [false, false, false, t]);
        }

        //function UpdateAdminSync(db, objAdminSync) {
        //    return $cordovaSQLite.execute(db, "UPDATE  Configurations  SET ConfigurationValue = ?  WHERE ID = ?", [objAdminSync.ConfigurationValue, objAdminSync.ID]);
        //}

        function DeleteAllLoginRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Login");
        }

        function DeleteAllResidentRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Residents");
        }

        function DeleteAllActionRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Actions");
        }
        function DeleteAllAction_DaysRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Actions_Days");
        }
        function DeleteAllInterventionsRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Interventions");
        }
        function DeleteAllActionAction_DaysInterventionsRecords(db) {
            var q = $q.defer();
            $cordovaSQLite.execute(db, "DELETE FROM Actions").then(function () {
                $cordovaSQLite.execute(db, "DELETE FROM Actions_Days").then(function () {
                    $cordovaSQLite.execute(db, "DELETE FROM Interventions").then(function () {
                        q.resolve();
                    }, function (err) {
                        q.reject(err);
                    });
                }, function (err) {
                    q.reject(err);
                });
            }, function (err) {
                q.reject(err);
            });
            return q.promise;
        }
        function DeleteAllInterventions_Resident_AnswersRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Interventions_Resident_Answers");
        }

        function DeleteAllResidentAdhocIntervention(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM ResidentAdhocInterventionDocuments");
        }

        function DeleteAllResident_Interventions_Questions_AnswersRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Resident_Interventions_Questions_Answers");
        }
        function DeleteAllResidents_Questions_AnswersRecords(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM Residents_Questions_Answers");
        }


        function DeleteResidentPhotos(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM ResidentPhotos");
        }


        function DeleteAllInterventionResidentAnswerDocuments(db) {
            return $cordovaSQLite.execute(db, "DELETE FROM InterventionResidentAnswerDocuments");
        }

        function DeleteAllResidentAnswerDocuments(db, t) {
            return $cordovaSQLite.execute(db, "DELETE FROM ResidentAnswerDocuments");
        }


        function DeleteInterventionResidentAnswerDocuments(db, t) {
            return $cordovaSQLite.execute(db, "Delete FROM InterventionResidentAnswerDocuments WHERE ID = '" + t + "'");
        }
        function DeleteResidentAnswerDocuments(db, t) {
            return $cordovaSQLite.execute(db, "Delete FROM ResidentAnswerDocuments WHERE ID = '" + t + "'");
        }
        function DeleteOfflineAdhocInterventions(db, t) {
            var q = $q.defer();
            UpdateActionsIsActiveFalse(db, t).then(function () {
                UpdateAction_DaysBasedonActionID(db, t).then(function () {
                    SelectAction_DaysBasedonActionID(db, t.ID).then(function (rs) {
                        if (rs.rows.length > 0) {
                            var differedArr = [];
                            for (var i = 0; i < rs.rows.length; i++) {
                                var deferred = $q.defer();
                                differedArr.push(deferred.promise);
                                UpdateInterventionsBasedonAction_DayID(db, rs.rows.item(i).ID).then(function () {
                                    deferred.resolve();
                                }, function error(err) {
                                    deferred.reject(err);
                                })
                                $q.all(differedArr).then(function () {
                                    q.resolve();
                                }, function error(err) {
                                    q.reject(err);
                                })
                            }
                        }
                    })
                }, function error(err) {

                })
            });
            return q.promise;
        }


        function UpdateActionsIsActiveFalse(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE Actions SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, false, t.ID]);
        }
        function UpdateAction_DaysBasedonActionID(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE Actions_Days SET IsActive = ?, IsSyncnised= ? WHERE ActionID = ?", [false, false, t.ID]);
        }
        function SelectAction_DaysBasedonActionID(db, t) {
            return $cordovaSQLite.execute(db, "SELECT * FROM Actions_Days WHERE ActionID=?", [t]);
        }
        function UpdateInterventionsBasedonAction_DayID(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Interventions SET IsActive = ?, IsSyncnised= ? WHERE Action_DayID = ?", [false, false, t]);
        }
        function UpdateAcceptAsResident(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Residents SET IsAccepted = ?, IsSyncnised= ? WHERE ID = ?", [true, false, t]);
        }
        function UpdateInterventionsStatus(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Interventions SET Comments = ?, MoodAfter = ?,OutCome = ?,Status = ?,Time_Span = ?,MoodDuring = ?,MoodBefore = ?,Exception = ?,IsHandOverNotes=?, IsSyncnised= ? WHERE ID = ?",
                [t.Comments, t.MoodAfter, t.OutCome, t.Status, t.Time_Span, t.MoodDuring, t.MoodBefore, t.Exception, t.IsHandOverNotes, false, t.ID]);
        }
        function UpdateInterventions_Resident_AnswersIsActive(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Interventions_Resident_Answers SET IsActive = ?, IsSyncnised= ? WHERE InterventionID = ? and ResidentID=?", [false, false, t.InterventionID, t.ResidentID]);
        }

        function UpdateInterventions_Resident_Answers(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Interventions_Resident_Answers SET IsActive = ?, IsSyncnised= ? WHERE InterventionID = ? and ResidentID=?", [false, true, t.InterventionID, t.ResidentID]);
        }
        function UpdateResidents_Questions_Answers(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Residents_Questions_Answers SET IsActive = ?, IsSyncnised= ?, Modified = ? , ModifiedBy = ? WHERE ID = ?", [false, false, t.Modified, t.ModifiedBy, t.ID]);
        }
        function UpdateResident_Interventions_Questions_Answers(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Resident_Interventions_Questions_Answers SET IsActive = ?, IsSyncnised= ?, Modified = ? , ModifiedBy = ? WHERE ID = ?", [false, false, t.Modified, t.ModifiedBy, t.ID]);
        }
        function UpdateResidents(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Residents SET FirstName= ?,LastName= ?,NickName= ?,Gender= ?,DOB= ?,DOJ= ?,Telephone= ?,Mobile= ?,GPDetails= ?,Nok= ?,NokTelephoneNumber= ?,NokAddress= ?,NokPreferred= ?,SocialWorker= ?,ReasonForAdmission= ?,IsAccepted= ?,AdmittedFrom= ?,NHS=?,MedicalHistory=?,LeavingDate=?,ReasonForLeaving=?,IsActive= ?,Modified= ?,ModifiedBy= ?,IsSyncnised= ?,IsCreated= ? WHERE ID = ?",
                                                                    [t.FirstName, t.LastName, t.NickName, t.Gender, t.DOB, t.DOJ, t.Telephone, t.Mobile, t.GPDetails, t.Nok, t.NokTelephoneNumber, t.NokAddress, t.NokPreferred, t.SocialWorker, t.ReasonForAdmission, t.IsAccepted, t.AdmittedFrom, t.NHS, t.MedicalHistory, t.LeavingDate, t.ReasonForAdmission, t.IsActive, t.Modified, t.ModifiedBy, t.IsSyncnised, t.IsCreated, t.ID]);
        }
        function UpdatePainMonitoring(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  PainMonitoring SET Description= ?,IsSyncnised= ?,IsCreated=? WHERE ID = ?", [t.Description, t.IsSyncnised, t.IsCreated, t.ID]);
        }
        function UploadPhoto_Offline(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  ResidentPhotos SET PhotoURL=?,IsActive = ?, IsSyncnised= ?, Modified = ? , ModifiedBy = ? WHERE ResidentID = ?", [t.PhotoURL, true, false, t.Modified, t.ModifiedBy, t.ResidentID]);
        }
        function UpdateExistingResidents_Questions_Answers(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Residents_Questions_Answers SET IsActive = ?, IsSyncnised= ?, Modified = ? , ModifiedBy = ? WHERE Section_Question_AnswerID = ? and ResidentID=?", [false, false, t.Modified, t.ModifiedBy, t.Section_Question_AnswerID, t.ResidentID]);
        }

        function UpdateOfflineActionAdhocInterventions(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Actions SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, true, t]);
        }


        function UpdateOfflineActionDaysAdhocInterventions(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Actions_Days SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, true, t.ID]);
        }

        function UpdateOfflineInterventionsAdhocInterventions(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Interventions SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, true, t.ID]);
        }

        function UpdateInterventions(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  Interventions SET Action_DayID= ?,PlannedStartDate= ?,PlannedEndDate= ?,ActualStartDate= ?,ActualEndDate= ?,Status= ?,Comments= ?,MoodAfter= ?,MoodDuring= ?,MoodBefore= ?,OutCome= ?,Exception= ?,Time_Span= ?,IsActive= ?,Created= ?,Modified= ?,ModifiedBy= ?,IsSyncnised= ?,IsCreated= ? WHERE ID = ?", [t.Action_DayID, t.PlannedStartDate, t.PlannedEndDate, t.ActualStartDate, t.ActualEndDate, t.Status, t.Comments, t.MoodAfter, t.MoodDuring, t.MoodBefore, t.OutCome, t.Exception, t.Time_Span, t.IsActive, t.Created, t.Modified, t.ModifiedBy, t.IsSyncnised, t.IsCreated, t.ID]);
        }
        //function UpdateInterventions(db, objUpdateIntervention) {

        //    return $cordovaSQLite.execute(db, "UPDATE  Interventions SET PlannedStartDate= ?,PlannedEndDate= ?,IsActive= ?,IsSyncnised= ?,IsCreated= ? WHERE ID = ?", [objUpdateIntervention.StartTime,objUpdateIntervention.EndTime,true,false, objUpdateIntervention.Id]);
        //}
        function UpdateResidentAnswerDocuments(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  ResidentAnswerDocuments SET FileName=?,ResidentFile= ? WHERE ID = ?", [t.FileName, t.ResidentFile, t.ID]);
        }

        function UpdateinsertResidentPhotos(db, t) {
            return $cordovaSQLite.execute(db, "UPDATE  ResidentPhotos SET PhotoURL=?,IsSyncnised= ?,IsCreated= ?,Modified=?,ModifiedBy=? WHERE ID = ?", [t.PhotoURL, t.IsSyncnised, t.IsCreated, t.Modified, t.ModifiedBy, t.ID]);
        }

        function UpdateLogin(db, objLogin) {
            return $cordovaSQLite.execute(db, "UPDATE Login SET LastLogin=?, IsSyncnised= ? WHERE UserID = ?", [objLogin.LastLogin, objLogin.IsSyncnised, objLogin.UserID]);
        }

        //---------------------------------------------------Insertion-------------------------------------
        function InsertLogin(db, objLogin) {
            var query = "INSERT INTO Login(UserID ,UserName,Password, LastLogin, RoleName, IsSyncnised ) VALUES (?,?,?,?,?,?)";
            return $cordovaSQLite.execute(db, query, [objLogin.UserID, objLogin.UserName, objLogin.Password, objLogin.LastLogin, objLogin.RoleName, objLogin.IsSyncnised]);
        }


        //function insertOfflineResidents(db, t) {
        //    var query = "INSERT INTO Residents(ID,OrganizationID,FirstName,LastName,NickName,Gender,DOB,DOJ,Telephone,Mobile,GPDetails,Nok,NokTelephoneNumber,NokAddress,NokPreferred,SocialWorker,ReasonForAdmission,IsAccepted,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
        //    return $cordovaSQLite.execute(db, query, [t.ID, t.OrganizationID, t.FirstName, t.LastName, t.NickName, t.Gender, t.DOB, t.DOJ, t.Telephone, t.Mobile, t.GPDetails, t.Nok, t.NokTelephoneNumber, t.NokAddress, t.NokPreferred, t.SocialWorker, t.ReasonForAdmission, t.IsAccepted, t.IsActive, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy, t.IsSyncnised, t.IsCreated]);
        //}

        function insertOfflineResidents(db, t) {
            var query = "INSERT INTO Residents(ID,OrganizationID,FirstName,LastName,NickName,Gender,DOB,DOJ,Telephone,Mobile,GPDetails,Nok,NokTelephoneNumber,NokAddress,NokPreferred,SocialWorker,ReasonForAdmission,IsAccepted,AdmittedFrom,NHS,MedicalHistory,LeavingDate,ReasonForLeaving,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            return $cordovaSQLite.execute(db, query, [t.ID, t.OrganizationID, t.FirstName, t.LastName, t.NickName, t.Gender, t.DOB, t.DOJ, t.Telephone, t.Mobile, t.GPDetails, t.Nok, t.NokTelephoneNumber, t.NokAddress, t.NokPreferred, t.SocialWorker, t.ReasonForAdmission, t.IsAccepted, t.AdmittedFrom, t.NHS, t.MedicalHistory, t.LeavingDate, t.ReasonForLeaving, t.IsActive, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy, t.IsSyncnised, t.IsCreated]);
        }
        function insertOfflineResidentPhotos(db, t) {
            var query = "INSERT INTO ResidentPhotos(ID,PhotoURL,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?)";
            return $cordovaSQLite.execute(db, query, [t.ID, t.PhotoURL, t.IsActive, t.Created, t.CreatedBy, null, null, t.IsSyncnised, t.IsCreated]);
        }

        function insertOfflinePainMonitoring(db, t) {
            var query = "INSERT INTO PainMonitoring(ID,ResidentID,OrganizationID,PartsID,Description,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            return $cordovaSQLite.execute(db, query, [t.ID, t.ResidentID, t.OrganizationID, t.PartsID, t.Description, t.IsActive, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy, t.IsSyncnised, t.IsCreated]);
        }

        //function insertOfflineResidentDocuments(db,t) {
        //    var query = "INSERT INTO ResidentAnswerDocuments(ID,ResidentID,ResidentQuestionAnswerID,FileName,ResidentFile,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated)) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        //    return $cordovaSQLite.execute(db, query, [t.ID, t.ResidentID, t.SectionQuestionAnswerID, t.FileName, t.ResidentFile, t.IsActive, t.Created, t.CreatedBy, null, null, t.IsSyncnised, t.IsCreated]);
        //    }

        function insertResidentsQAsDocuments(db, t) {
            var query = "INSERT INTO ResidentAnswerDocuments(ID,FileName,ResidentFile,IsActive,Created,CreatedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?)";
            return $cordovaSQLite.execute(db, query, [t.ID, t.FileName, t.ResidentFile, t.IsActive, t.Created, t.CreatedBy, t.IsSyncnised, t.IsCreated]);
        }
        function insertInterventionResidentQAsDocuments(db, t) {
            var query = "INSERT INTO InterventionResidentAnswerDocuments(ID,FileName,ResidentFile,IsActive,Created,CreatedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?)";
            return $cordovaSQLite.execute(db, query, [t.ID, t.FileName, t.ResidentFile, t.IsActive, t.Created, t.CreatedBy, t.IsSyncnised, t.IsCreated]);
        }
        function insertInterventionResidentAnswerDocuments(db, t) {
            var query = "INSERT INTO InterventionResidentAnswerDocuments(ID, FileName, ResidentFile,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");//10
                data.push(t[i].ID); data.push(t[i].FileName); data.push(t[i].ResidentFile); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertResidentAnswerDocuments(db, t) {
            var query = "INSERT INTO ResidentAnswerDocuments(ID, FileName, ResidentFile,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");//10
                data.push(t[i].ID); data.push(t[i].FileName); data.push(t[i].ResidentFile); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertResidentAdhocInterventionDocuments(db, t) {
            var query = "INSERT INTO ResidentAdhocInterventionDocuments(ID, FileName, ResidentFile,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");//10
                data.push(t[i].ID); data.push(t[i].FileName); data.push(t[i].ResidentFile); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }
        function insertResidentPhotos(db, t) {
            var query = "INSERT INTO ResidentPhotos(ID, PhotoURL,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].PhotoURL); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertActions(db, t) {
            var query = "INSERT INTO Actions(ID,ResidentID,Section_InterventionID,StartDate,EndDate,Occurrences,Type,Interval,Instance,Month,IsAdhocIntervention,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//18
                data.push(t[i].ID); data.push(t[i].ResidentID); data.push(t[i].Section_InterventionID); data.push(t[i].StartDate); data.push(t[i].EndDate); data.push(t[i].Occurrences); data.push(t[i].Type); data.push(t[i].Interval); data.push(t[i].Instance); data.push(t[i].Month); data.push(t[i].IsAdhocIntervention); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertActions_Days(db, t) {
            var query = "INSERT INTO Actions_Days(ID,ActionID,Day,Date,StartTime,EndTime,Specifications,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//14
                data.push(t[i].ID); data.push(t[i].ActionID); data.push(t[i].Day); data.push(t[i].Date); data.push(t[i].StartTime); data.push(t[i].EndTime); data.push(t[i].Specifications); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertIntervention_Question(db, t) {
            var query = "INSERT INTO Intervention_Question(ID,Section_InterventionID,Question,AnswerType,MinScore,MaxScore,Score,DisplayOrder,IsInAssessment,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//14
                data.push(t[i].ID); data.push(t[i].Section_InterventionID); data.push(t[i].Question); data.push(t[i].AnswerType); data.push(t[i].MinScore); data.push(t[i].MaxScore); data.push(t[i].Score); data.push(t[i].DisplayOrder); data.push(t[i].IsInAssessment); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertIntervention_Question_Answer(db, t) {
            var query = "INSERT INTO Intervention_Question_Answer(ID,Section_InterventionID,Intervention_QuestionID,LabelText,IsDefault,Score,DisplayOrder,AnswerType,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?)");//13
                data.push(t[i].ID); data.push(t[i].Section_InterventionID); data.push(t[i].Intervention_QuestionID); data.push(t[i].LabelText); data.push(t[i].IsDefault); data.push(t[i].Score); data.push(t[i].DisplayOrder); data.push(t[i].AnswerType); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertIntervention_Question_Answer_Task(db, t) {
            var query = "INSERT INTO Intervention_Question_Answer_Task(ID,InterventionQuestionID,InterventionAnswerID,Section_InterventionID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].InterventionQuestionID); data.push(t[i].InterventionAnswerID); data.push(t[i].Section_InterventionID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertIntervention_Question_ParentQuestion(db, t) {
            var query = "INSERT INTO Intervention_Question_ParentQuestion(ID,InterventionQuestionID,InterventionParentQuestionID,InterventionParentAnswerID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].InterventionQuestionID); data.push(t[i].InterventionParentQuestionID); data.push(t[i].InterventionParentAnswerID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertInterventions(db, t) {
            var query = "INSERT INTO Interventions(ID,Action_DayID,PlannedStartDate,PlannedEndDate,ActualStartDate,ActualEndDate,Status,Comments,MoodAfter,MoodDuring,MoodBefore,OutCome,Exception,Time_Span,IsActive,IsHandOverNotes,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];
            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//22
                data.push(t[i].ID); data.push(t[i].Action_DayID); data.push(t[i].PlannedStartDate); data.push(t[i].PlannedEndDate); data.push(t[i].ActualStartDate); data.push(t[i].ActualEndDate); data.push(t[i].Status); data.push(t[i].Comments); data.push(t[i].MoodAfter); data.push(t[i].MoodDuring); data.push(t[i].MoodBefore); data.push(t[i].OutCome); data.push(t[i].Exception); data.push(t[i].Time_Span); data.push(t[i].IsActive); data.push(t[i].IsHandOverNotes); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertInterventions_Question_Answer_Summary(db, t) {
            var query = "INSERT INTO Interventions_Question_Answer_Summary(ID,Intervention_Question_AnswerID,InterventionQuestionID,SectionSummaryID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].Intervention_Question_AnswerID); data.push(t[i].InterventionQuestionID); data.push(t[i].SectionSummaryID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertInterventions_Resident_Answers(db, t) {
            var query = "INSERT INTO Interventions_Resident_Answers(ID,InterventionID,ResidentID,Intervention_Question_AnswerID,AnswerText,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?)");//12
                data.push(t[i].ID); data.push(t[i].InterventionID); data.push(t[i].ResidentID); data.push(t[i].Intervention_Question_AnswerID); data.push(t[i].AnswerText); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertOrganizationGroups(db, t) {
            var query = "INSERT INTO OrganizationGroups(ID,Name,Description,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?)");//8
                data.push(t[i].ID); data.push(t[i].Name); data.push(t[i].Description); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertOrganizationGroups_Organizations(db, t) {
            var query = "INSERT INTO OrganizationGroups_Organizations(ID,OrganizationGroupID,OrganizationID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?)");//8
                data.push(t[i].ID); data.push(t[i].OrganizationGroupID); data.push(t[i].OrganizationID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertOrganizations(db, t) {
            var query = "INSERT INTO Organizations(ID,Name,Description,Address,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].Name); data.push(t[i].Description); data.push(t[i].Address); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertQuestionParentQuestion(db, t) {
            var query = "INSERT INTO Question_ParentQuestion(ID,QuestionID,ParentQuestionID,ParentAnswerID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].QuestionID); data.push(t[i].ParentQuestionID); data.push(t[i].ParentAnswerID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertResident_Interventions_Questions_Answers(db, t) {
            var query = "INSERT INTO Resident_Interventions_Questions_Answers(ID,ResidentID,Intervention_Question_AnswerID,AnswerText,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");//11
                data.push(t[i].ID); data.push(t[i].ResidentID); data.push(t[i].Intervention_Question_AnswerID); data.push(t[i].AnswerText); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        //function insertResidents(db, t) {
        //    var query = "INSERT INTO Residents(ID,OrganizationID,FirstName,LastName,NickName,Gender,DOB,DOJ,Telephone,Mobile,GPDetails,Nok,NokTelephoneNumber,NokAddress,NokPreferred,SocialWorker,ReasonForAdmission,IsAccepted,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
        //    var data = [];
        //    var rowArgs = [];
        //    for (var i = 0; i < t.length; i++) {
        //        rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//25
        //        data.push(t[i].ID); data.push(t[i].OrganizationID); data.push(t[i].FirstName); data.push(t[i].LastName); data.push(t[i].NickName); data.push(t[i].Gender); data.push(t[i].DOB); data.push(t[i].DOJ); data.push(t[i].Telephone); data.push(t[i].Mobile); data.push(t[i].GPDetails);
        //        data.push(t[i].Nok); data.push(t[i].NokTelephoneNumber); data.push(t[i].NokAddress); data.push(t[i].NokPreferred); data.push(t[i].SocialWorker); data.push(t[i].ReasonForAdmission); data.push(t[i].IsAccepted);data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
        //    }
        //    query += rowArgs.join(", ");
        //    return $cordovaSQLite.bulkInsert(db, query, [data]);
        //}

        function insertResidents(db, t) {
            var query = "INSERT INTO Residents(ID,OrganizationID,FirstName,LastName,NickName,Gender,DOB,DOJ,Telephone,Mobile,GPDetails,Nok,NokTelephoneNumber,NokAddress,NokPreferred,SocialWorker,ReasonForAdmission,IsAccepted,AdmittedFrom,NHS,MedicalHistory,LeavingDate,ReasonForLeaving,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];
            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//30
                data.push(t[i].ID); data.push(t[i].OrganizationID); data.push(t[i].FirstName); data.push(t[i].LastName); data.push(t[i].NickName); data.push(t[i].Gender); data.push(t[i].DOB); data.push(t[i].DOJ); data.push(t[i].Telephone); data.push(t[i].Mobile); data.push(t[i].GPDetails);
                data.push(t[i].Nok); data.push(t[i].NokTelephoneNumber); data.push(t[i].NokAddress); data.push(t[i].NokPreferred); data.push(t[i].SocialWorker); data.push(t[i].ReasonForAdmission); data.push(t[i].IsAccepted); data.push(t[i].AdmittedFrom != null ? t[i].AdmittedFrom : ""); data.push(t[i].NHS != null ? t[i].NHS : ""); data.push(t[i].MedicalHistory != null ? t[i].MedicalHistory : ""); data.push(t[i].LeavingDate); data.push(t[i].ReasonForLeaving); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertResidents_Questions_Answers(db, t) {
            var query = "INSERT INTO Residents_Questions_Answers(ID,ResidentID,Section_Question_AnswerID,AnswerText,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");//11
                data.push(t[i].ID); data.push(t[i].ResidentID); data.push(t[i].Section_Question_AnswerID); data.push(t[i].AnswerText); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertResidents_Relatives(db, t) {
            var query = "INSERT INTO Residents_Relatives(ID,ResidentID,UserID,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");//10
                data.push(t[i].ID); data.push(t[i].ResidentID); data.push(t[i].UserID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertRolesService(db, t) {
            var query = "INSERT INTO Roles(ID,Name,IsActive) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?)");//3
                [t.ID, t.Name, t.IsActive]
                data.push(t[i].ID); data.push(t[i].Name); data.push(t[i].IsActive);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSection_Intervention(db, t) {
            var query = "INSERT INTO Section_Intervention(ID,InterventionTitle,InterventionIcon,MaxScore,MinScore,Parent_InterventionID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?)");//11
                data.push(t[i].ID); data.push(t[i].InterventionTitle); data.push(t[i].InterventionIcon); data.push(t[i].MaxScore); data.push(t[i].MinScore); data.push(t[i].Parent_InterventionID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSection_Intervention_Statements(db, t) {
            var query = "INSERT INTO Section_Intervention_Statements(ID,Statements,Section_InterventionID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?)");//8
                data.push(t[i].ID); data.push(t[i].Statements); data.push(t[i].Section_InterventionID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSection_Summary(db, t) {
            var query = "INSERT INTO Section_Summary(ID,Summary,IsAnswerText,MaxScore,MinScore,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");//10
                data.push(t[i].ID); data.push(t[i].Summary); data.push(t[i].IsAnswerText); data.push(t[i].MaxScore); data.push(t[i].MinScore); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSections(db, t) {
            var query = "INSERT INTO Sections(ID,Name,DisplayOrder,IsActive,Created,CreatedBy,Modified,ModifiedBy,HasScore,HasSummary) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?)");//10
                data.push(t[i].ID); data.push(t[i].Name); data.push(t[i].DisplayOrder); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].HasScore); data.push(t[i].HasSummary);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSections_Organizations(db, t) {
            var query = "INSERT INTO Sections_Organizations(ID,SectionID,OrganizationID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?)");//8
                data.push(t[i].ID); data.push(t[i].SectionID); data.push(t[i].OrganizationID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSectionsQuestions(db, t) {
            var query = "INSERT INTO Sections_Questions(ID,SectionID,Question,QuestionView,AnswerType,MinScore,MaxScore,Score,DisplayOrder,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//14
                data.push(t[i].ID); data.push(t[i].SectionID); data.push(t[i].Question); data.push(t[i].QuestionView); data.push(t[i].AnswerType); data.push(t[i].MinScore); data.push(t[i].MaxScore); data.push(t[i].Score); data.push(t[i].DisplayOrder); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSections_Questions_Answers(db, t) {
            var query = "INSERT INTO Sections_Questions_Answers(ID,SectionID,Section_QuestionID,LabelText,IsDefault,Score,DisplayOrder,AnswerType,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?)");//13
                data.push(t[i].ID); data.push(t[i].SectionID); data.push(t[i].Section_QuestionID); data.push(t[i].LabelText); data.push(t[i].IsDefault); data.push(t[i].Score); data.push(t[i].DisplayOrder); data.push(t[i].AnswerType); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSections_Questions_Answers_Summary(db, t) {
            var query = "INSERT INTO Sections_Questions_Answers_Summary(ID,Section_QuestionID,Section_Question_AnswerID,SectionSummaryID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].Section_QuestionID); data.push(t[i].Section_Question_AnswerID); data.push(t[i].SectionSummaryID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSections_Questions_Answers_Tasks(db, t) {
            var query = "INSERT INTO Sections_Questions_Answers_Tasks(ID,Section_QuestionID,Section_Question_AnswerID,Section_InterventionID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].Section_QuestionID); data.push(t[i].Section_Question_AnswerID); data.push(t[i].Section_InterventionID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertSections_Questions_Answers_Widget(db, t) {
            var query = "INSERT INTO Sections_Questions_Answers_Widget(ID,Section_QuestionID,Section_Question_AnswerID,Widget,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {

                rowArgs.push("(?,?,?,?,?,?,?,?,?)");//9
                data.push(t[i].ID); data.push(t[i].Section_QuestionID); data.push(t[i].Section_Question_AnswerID); data.push(t[i].Widget); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertUsers(db, t) {
            var query = "INSERT INTO Users(ID,FirstName,LastName,Email,Designation,DOB,TelePhone,UserName,Password,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");//14
                data.push(t[i].ID); data.push(t[i].FirstName); data.push(t[i].LastName); data.push(t[i].Email); data.push(t[i].Designation); data.push(t[i].DOB); data.push(t[i].Telephone); data.push(t[i].UserName); data.push(t[i].Password); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertUsers_Organizations(db, t) {
            var query = "INSERT INTO Users_Organizations(ID,UserID,OrganizationID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?)");//8
                data.push(t[i].ID); data.push(t[i].UserID); data.push(t[i].OrganizationID); data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertUser_Roles(db, t) {
            var query = "INSERT INTO Users_Roles(ID,UserID,RoleID,IsActive) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?)");//4
                [t.ID, t.UserID, t.RoleID, t.IsActive]
                data.push(t[i].ID); data.push(t[i].UserID); data.push(t[i].RoleID); data.push(t[i].IsActive);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }


        function insertUser_Types(db, t) {
            var query = "INSERT INTO UserType(ID,Name) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?)");//2
                [t.ID, t.Name]
                data.push(t[i].ID); data.push(t[i].Name);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        function insertPainMonitoring(db, t) {
            var query = "INSERT INTO PainMonitoring(ID,ResidentID,OrganizationID,PartsID,Description,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?,?,?,?,?,?,?,?,?)");//12
                data.push(t[i].ID); data.push(t[i].ResidentID); data.push(t[i].OrganizationID); data.push(t[i].PartsID); data.push(t[i].Description), data.push(t[i].IsActive); data.push(t[i].Created); data.push(t[i].CreatedBy); data.push(t[i].Modified); data.push(t[i].ModifiedBy); data.push(t[i].IsSyncnised); data.push(t[i].IsCreated);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

        //Anil
        function insertConfigurations(db, t) {
            var query = "INSERT INTO Configurations(ID,OrganizationID,ConfigurationKey,ConfigurationValue) VALUES ";
            var data = [];
            var rowArgs = [];

            for (var i = 0; i < t.length; i++) {
                rowArgs.push("(?,?,?,?)");//12
                data.push(t[i].ID); data.push(t[i].OrganizationID); data.push(t[i].ConfigurationKey); data.push(t[i].ConfigurationValue);
            }
            query += rowArgs.join(", ");
            return $cordovaSQLite.bulkInsert(db, query, [data]);
        }

    }

}());