#include "config/translations.jsxinc"

DuESF.preInitMethods.push(function ()
    {
        // Extract translations
        var outputFolder = DuESF.scriptSettings.file.parent.absoluteURI + '/';

        Duik_de.toFile( outputFolder + 'Duik_de.json', false );
        Duik_es.toFile( outputFolder + 'Duik_es.json', false );
        Duik_fr.toFile( outputFolder + 'Duik_fr.json', false );
        Duik_zh.toFile( outputFolder + 'Duik_zh.json', false );
        Duik_ru.toFile( outputFolder + 'Duik_ru.json', false );
    }
);