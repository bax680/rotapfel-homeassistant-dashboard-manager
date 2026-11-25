# Rotapfel Homeassistant Dashboard Control Manager

Erstelle und verwalte eigene Home-Assistant-Dashboards mit einem grafischen Layout-Editor. Ordne Karten nach Tabs und Räumen, speichere Vorlagen und passe die Arbeitsfläche an Desktop, Tablet und Smartphone an.

**Source Archive:** Alpha 13.9.60 · **Integrationsversion:** `0.2.0a13960` · **Domain:** `rotapfel_dashboard_manager`

## Installation und erster Start

Vorausgesetzt werden ein Home-Assistant-Administratorkonto und der integrierte Marketplace. Die Entwicklung wurde mit Home Assistant Core 2026.11.0 erprobt. Diese Angabe beschreibt den getesteten Stand.

<!-- ha-marketplace:exclude-start -->
[![Rotapfel im Home Assistant Marketplace öffnen](https://my.home-assistant.io/badges/marketplace_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=bax680&repository=rotapfel-homeassistant-dashboard-manager&category=integration)

Der Link öffnet das Repository im Marketplace deiner Instanz. Bestätige das Hinzufügen als benutzerdefiniertes Repository vom Typ **Integration**. Für benutzerdefinierte Repositories benötigt der Marketplace eine GitHub-Verbindung. Alternativ kannst du im Marketplace die folgende Repository-URL eintragen:

`https://github.com/bax680/rotapfel-homeassistant-dashboard-manager`
<!-- ha-marketplace:exclude-end -->

1. Installiere **Rotapfel Dashboard Control Manager** im Marketplace.
2. Starte Home Assistant neu.
3. Öffne **Einstellungen → Geräte & Dienste → Integration hinzufügen** und suche nach **Rotapfel Dashboard Control Manager**.
4. Öffne danach **Rotapfel Control** in der Seitenleiste. Wenn der Tab bereits geöffnet war, lade die Browserseite neu.

Für eine manuelle Installation kopierst du `custom_components/rotapfel_dashboard_manager` aus dem Quellarchiv unter `/config/custom_components/`. Danach gelten dieselben Schritte für Neustart und Einrichtung.

## Sprache des Rotapfel Managers

In der Übersicht kannst du **Automatisch**, **Deutsch** oder **English** auswählen. Automatisch folgt zuerst der ausdrücklich gewählten Home-Assistant-Profilsprache. Ohne diese Einstellung verwendet Rotapfel Deutsch für Deutschland, Österreich und die Schweiz, sonst Englisch. Ohne Länderangabe gilt die Browsersprache. Die Auswahl gilt pro Benutzerkonto im jeweiligen Browser. Rotapfel übersetzt seine Bedienelemente, Dialoge und Meldungen. Namen und Inhalte, die du selbst eingibst, behalten ihre Schreibweise. Native Karteneditoren verwenden weiterhin die Home-Assistant-Sprache.

## Erstes Dashboard erstellen

1. Wähle in der Übersicht **Dashboard erstellen** und vergib einen Namen.
2. Öffne den **Layoutmanager**. Lege einen Tab und darin einen Raum an.
3. Wähle **Karte hinzufügen**. Wähle den Kartentyp und gegebenenfalls die Home-Assistant-Entität. Für eigene Custom Cards kannst du eine YAML- oder JSON-Konfiguration hinterlegen.
4. Wähle eine Karte in der Raumübersicht aus. **Design**, **Position** und die übrigen Kartenaktionen sind direkt sichtbar. Kartenspezifische Einstellungen erscheinen abhängig vom Typ.
5. Speichere das Layout. Öffne bei Bedarf die Positionierungsfläche über den aktiven Tab.

Tabs gliedern das Dashboard, etwa nach Etagen. Räume organisieren die Karten innerhalb eines Tabs. Ein Geräteprofil bestimmt die Arbeitsfläche für das jeweilige Endgerät. Wähle das Profil vor der Bearbeitung, weil Positionen und Größen je Profil gespeichert werden.

## Home-Assistant-Standardkarten

1. Öffne im gewünschten Raum **Karte hinzufügen** und wähle im Dropdown **Kategorie** den Eintrag **Home Assistant**.
2. Suche nach einer Standardkarte, etwa Wettervorhersage, Entitäten oder einem vertikalen Stapel. Wähle die Karte aus und klicke auf **Karte hinzufügen**.
3. Konfiguriere die Karte im nativen Home-Assistant-Editor, sofern dieser für den Typ verfügbar ist. Alternativ kannst du die Konfiguration als YAML oder JSON eingeben. Bei Stapeln enthält die Konfiguration auch die untergeordneten Karten.
4. Speichere das Layout und prüfe die Karte in der Vorschau. Über **Veröffentlichen** oder **Aktualisieren** übernimmst du sie in das veröffentlichte Dashboard.

Die verfügbaren Kartentypen und Daten hängen von deiner Home-Assistant-Version und Einrichtung ab. Energie- und Verbrauchskarten benötigen die passenden Daten in Home Assistant. Für die Standardkarten selbst brauchst du keine zusätzliche Marketplace-Ressource.

## Beschriftungen

Wähle unter **Karte hinzufügen** in der Kategorie **Sonstige** den Typ **Beschriftung horizontal** oder **Beschriftung vertikal** und gib den Text ein. Die Karte benötigt keine Entität. Die vertikale Beschriftung liest sich von unten nach oben. Text, Design und Position lassen sich über die üblichen Kartenaktionen bearbeiten.

## Karten positionieren und skalieren

- **Positionierungsfläche öffnen:** Ziehe Karten an ihre Position. Raster, Magnet und Hilfslinien helfen beim Ausrichten. Auf dem Smartphone findest du die Werkzeuge unter **Navigation**.
- **Mehrfachauswahl:** Wähle einzelne Karten oder **Alle Karten auswählen**. Für die Tab-Anordnung gibt es Einstellungen für Gruppen und Flächennutzung.
- **Ideale Größe:** Berechnet Zielmaße für ausgewählte Karten anhand des Kartentyps und der verfügbaren Profilbreite. Mushroom Entity Cards verwenden eine Rotapfel-Zielbreite von bis zu 320 CSS-Pixeln. Andere Typen verwenden ihre jeweiligen Regeln.
- **Rahmen automatisch anpassen:** Passt den Rahmen an den sichtbaren Karteninhalt an. Die Rahmenanpassung greift auch beim Ändern einer Kartengröße über **Ideale Größe**, per Eingabefeld oder durch Ziehen.
- **Sperren:** Prüfe Größen-, Positions- und Layoutsperren, falls eine Karte bei einer Sammelaktion unverändert bleibt.
- **Automatisch anordnen:** Ordnet Karten mit ihren aktuellen Maßen an. Wenn du zuerst die Größen ändern möchtest, führe **Ideale Größe** vor der Anordnung aus.

## Vorlagen und Kartenbibliothek

Über **In Kartenbibliothek speichern** legst du eine Kartenkonfiguration als Vorlage ab. Öffne im gewünschten Raum **Gespeicherte Vorlagen**, markiere eine oder mehrere Karten und wähle den Zielraum. Die Einfügevorschau zeigt die geplante Platzierung. Bei Platzmangel bleibt der Stapel unverändert. Mit **Einfügen rückgängig** kannst du die letzte Einfügung im Editor zurücknehmen.

Beim Duplizieren einer Karte zeigt Rotapfel ebenfalls eine Einfügevorschau. **Layout-Vorlagen** sind für den Aufbau eines ganzen Dashboards vorgesehen. Das Anwenden einer Layout-Vorlage ersetzt den aktuellen Layoutentwurf.

## Custom Cards und Lovelace-Ressourcen

Die native Rotapfel-Entitätskarte und die mitgelieferte **Rotapfel Simple ThermCard** kannst du direkt im Manager auswählen. Bei Lovelace-Ressourcen im Storage-Modus versucht die Integration, die ThermCard-Ressource beim Start zu registrieren. Falls sie fehlt, füge `/rotapfel_dashboard_manager/rotapfel-simple-thermcard.js` als JavaScript-Modul hinzu. Ihr Kartentyp lautet `custom:rotapfel-simple-thermcard`.

Equinox, Climate Cluster Card und Mushroom sind optionale Erweiterungen. Installiere und registriere die jeweilige Lovelace-Ressource, wenn du den Kartentyp verwendest.

| Karte | Installation |
| --- | --- |
| Equinox | [Im Marketplace öffnen](https://my.home-assistant.io/redirect/marketplace_repository/?owner=KipK&repository=equinox&category=plugin) · [Original-Repository](https://github.com/KipK/equinox) |
| Climate Cluster Card | [Im Marketplace öffnen](https://my.home-assistant.io/redirect/marketplace_repository/?owner=rickyfont94&repository=climate-cluster-card&category=plugin) · [Original-Repository](https://github.com/rickyfont94/climate-cluster-card) |

Unter **Custom-Card-Ressourcen** kannst du die verfügbaren Zuordnungen prüfen. Der Custom-Card-Editor bietet für unterstützte Typen Schnelleinstellungen für Anzeigename, Icon und Iconfarbe. Individuelle Optionen stehen in der YAML- oder JSON-Konfiguration.

## Darstellung veröffentlichter Dashboards

Im Layoutmanager stehen **Dashboard-Darstellung** und **Tab-Darstellung** zur Verfügung. Der Dashboard-Hintergrund gilt für alle Tabs, die ihn übernehmen. Jeder Tab kann stattdessen seine eigene Hintergrundfarbe und ein eigenes Bild verwenden. Bilder lassen sich in Home Assistant auswählen, über einen lokalen Bildpfad eintragen oder als PNG, JPEG und WebP bis 640 KiB hochladen. Bildgröße, Position, Wiederholung und Deckkraft sind einstellbar. Die Bilddeckkraft wirkt nur auf das Bild. Hochgeladene Dateien werden auf dieser Home-Assistant-Instanz über einen statischen Bildpfad bereitgestellt. Beim Umzug auf eine andere Instanz müssen die Bilddateien mit übernommen werden.

### Navigation und Raumtabs einstellen

1. Öffne **Layout bearbeiten → Design & Raster → Navigation konfigurieren**. In der Positionierungsfläche gibt es denselben Button in der Werkzeugleiste und auf Mobilgeräten im Werkzeugmenü.
2. Wähle unter **Tab-Navigation** zwischen Manager-Leiste, Navigationsleiste, einzelnen Schaltflächen und keiner Tab-Navigation. Die Manager-Leiste steht oben links. Die Navigationsleiste lässt sich oben mittig, oben links, unten mittig, links oder rechts platzieren.
3. Aktiviere **Raumtabs anzeigen**, wenn Besucher zwischen Räumen wechseln sollen. Bei ausgeblendeten Raumtabs zeigt das Dashboard alle Karten des Tabs an ihren gespeicherten Koordinaten. Im Editor kannst du weiterhin nach Raum arbeiten.
4. Unter **Stil der Dashboard-Navigation** und **Stil der Raumtabs** stellst du Stil, Schriftgröße und Innenabstand getrennt ein. Für aktive und inaktive Tabs lassen sich Schrift- und Hintergrundfarbe separat eingeben. Farben verwenden `#RRGGBB`, zum Beispiel `#ffffff`. Leere Felder verwenden die Standardwerte.
5. Wähle **Übernehmen** und anschließend **Layout speichern**. Die Positionierungsfläche zeigt die Leisten innerhalb ihres Außenrahmens an der gewählten Position. Einen abweichenden Anzeigenamen für einen einzelnen Tab vergibst du unter **Tab-Darstellung**.

**Kiosk-Modus auf allen Tabs** blendet die Home-Assistant-Seitenleiste und die native Dashboard-Kopfzeile aus. Die gewählte Rotapfel-Tab-Navigation kann weiterhin angezeigt werden. Mit `?rotapfel_exit_kiosk=1` am Ende der URL öffnest du das Dashboard mit Home-Assistant-Seitenleiste. Bei einer URL mit vorhandenen Parametern verwende `&rotapfel_exit_kiosk=1`.

**Layout speichern** überträgt die Darstellungsoptionen auch in eine bestehende Veröffentlichung. Verwende **Veröffentlichung aktualisieren**, wenn du auch Karten, Tab-Struktur oder die neuen Tab-Adressen übernehmen möchtest.

## Dashboard veröffentlichen

1. Prüfe unter **Einstellungen → Dashboards → Ressourcen**, ob `/rotapfel_dashboard_manager/rotapfel-canvas-card.js` als JavaScript-Modul eingetragen ist. Ergänze die Ressource, falls sie fehlt.
2. Speichere den Layoutentwurf und wähle in der Rotapfel-Übersicht **Veröffentlichen**.
3. Wähle **Alle angemeldeten Benutzer**, **Ausgewählte Benutzer** oder **Nur Administratoren**. Bei **Ausgewählte Benutzer** markierst du ein oder mehrere aktive Konten. Das Dashboard erscheint unter seinem Namen direkt in der Seitenleiste. Auch andere Konten können den Namen in der Seitenleiste sehen. Nur ausgewählte Konten können das Layout abrufen.
4. Nach späteren Layoutänderungen speicherst du den Entwurf und wählst **Veröffentlichung aktualisieren**. Bei einer Benutzerfreigabe kannst du dabei auch die Konten ändern.

### Lesbare Dashboard-Links

Bei Freigaben an ausgewählte Benutzer erhältst du Links wie `/rotapfel-shared/wallpanel/erdgeschoss`. Ein ausgewählter Raum ergänzt den Pfad, etwa `/rotapfel-shared/wallpanel/erdgeschoss/bad`. Der Präfix gehört zum Rotapfel-Bereich in Home Assistant. Vorhandene Freigabe-Links mit der internen Dashboard-ID bleiben erreichbar. Wähle für vorhandene Veröffentlichungen einmal **Veröffentlichung aktualisieren**, damit auch die Tab-Adressen lesbare Namen erhalten. Bei gleichen Namen ergänzt Rotapfel eine laufende Nummer.

Reguläre Lovelace-Veröffentlichungen behalten ihren bestehenden Dashboard-Pfad. Der Tab erhält einen lesbaren Pfadabschnitt und der gewählte Raum die optionale Angabe `?raum=bad`. Nach einem Wechsel des Tab-Pfads sollten entsprechende Lovelace-Lesezeichen aktualisiert werden.

Home Assistant prüft die Benutzerfreigabe beim Abrufen des veröffentlichten Rotapfel-Layouts auf dem Server. Entitätsberechtigungen gelten weiterhin separat. Zum Wechsel zwischen einer Benutzerfreigabe und einem regulären Lovelace-Dashboard entfernst du die Veröffentlichung und veröffentlichst das gespeicherte Layout erneut.

Der Rotapfel-Editor selbst ist Administratoren vorbehalten. Der Zugriff auf das veröffentlichte Dashboard richtet sich nach der gewählten Einstellung. Ältere Veröffentlichungen ohne Rotapfel-Kennung müssen für die weitere Verwaltung neu veröffentlicht werden. Über **Veröffentlichung entfernen** kannst du die alte Verknüpfung lösen. Prüfe anschließend den vorhandenen Home-Assistant-Eintrag, bevor du am selben Pfad neu veröffentlichst.

## Sicherungen, Updates und Rückmeldungen

- **Versionen** zeigt den Layoutverlauf und bietet manuelle Sicherungspunkte. Nach einer Wiederherstellung kannst du das veröffentlichte Dashboard separat aktualisieren.
- Ein **JSON-Export** sichert den Rotapfel-Entwurf. Der JSON-Import legt eine eigenständige Kopie an. Prüfe bei einem Import auf einer anderen Instanz die Entitäts-IDs und die Ressourcen der Custom Cards.
- Der **Lovelace-YAML-Export** ist für die Nutzung in Home Assistant gedacht. Er ersetzt die Manager-Sicherung nicht.
- Erstelle vor einem Update eine Sicherung. Installiere das Update über den Marketplace, starte Home Assistant neu und lade den geöffneten Browser-Tab neu.
- Melde Fehler über die [GitHub-Issues](https://github.com/bax680/rotapfel-homeassistant-dashboard-manager/issues). Hilfreich sind die Rotapfel- und Home-Assistant-Version, Gerät und Browser, die Schritte zur Wiederholung und das erwartete und beobachtete Ergebnis. Entferne private Entitätsnamen, URLs und Zugangsdaten aus Screenshots oder Protokollen.

## Lizenz und Herkunft

Die gebündelte **Rotapfel Simple ThermCard** basiert auf **DashHaus ORB** von **Krystian Czesak** (Copyright © 2026). Der MIT-Lizenztext und der ursprüngliche Copyright-Hinweis stehen in [LICENSE](LICENSE). Die Hinweise auf gebündelte Drittkomponenten, etwa React und ReactDOM, bleiben im JavaScript erhalten. [Upstream-Projekt](https://github.com/krystosterone/dashhaus)

Der eigenständige Rotapfel Dashboard Manager steht ebenfalls unter der [MIT-Lizenz](LICENSE). Copyright © 2026 Jan Schwamberger.

## Entwicklungshistorie

### Kartenbibliothek (Alpha 13.9.33)

Im Raumeditor können fertig konfigurierte Karten über **In Kartenbibliothek speichern** als wiederverwendbare Vorlage in Home Assistants persistentem Speicher abgelegt werden. Über **Aus Kartenbibliothek** mit einer Dropdownliste der gespeicherten Vorlagennamen lassen sie sich in anderen Räumen und Dashboards einfügen. Position, Geräteprofile, Gruppenbindung und Karten-ID werden nicht aus der Vorlage übernommen; die neue Karte erhält einen freien Platz. Maximal 100 Vorlagen.

### Alpha 13.9.33 – Kartenbibliothek V2, Platzierung, Schnelleinstellungen

Die gespeicherten Kartenvorlagen werden in einer durchsuchbaren grafischen Bibliothek mit Kartentyp und Entität angezeigt. Vorlagen lassen sich einfügen, umbenennen, bearbeiten oder nach Bestätigung löschen. Die gespeicherten Vorlagen bleiben im Home-Assistant-Store; bestehende Karten werden nicht rückwirkend geändert. Bei fehlendem freiem Platz versucht die automatische Platzierung vorsichtig, ausschließlich ungesperrte, ungruppierte Karten desselben Raums ohne separate Geräte-Layouts als Ganzes zu verschieben. Andernfalls bleibt die bisherige Kollisionswarnung. Für ausgewählte Mushroom- und Button-Cards bietet der Custom-Card-Editor zusätzlich Schnellfelder für Name, Icon und Farbe, ohne den YAML-Editor zu ersetzen.

### Alpha 13.9.34

Behebt den JavaScript-Syntaxfehler, der das Laden des Manager-Panels verhinderte.

### Alpha 13.9.35

Übernimmt Vorlagennamen beim Einfügen in die Kartenvorschau und platziert Duplikate ohne Überlagerung.

### Alpha 13.9.36

Längere Kartentitel lassen sich speichern. Meldungen zu ungültigen Kartendaten nennen Tab, Raum und Kartennummer.

### Alpha 13.9.37

Zeigt die Schnelleinstellungen für unterstützte Custom Cards auch bei Typen aus vorhandener YAML-Konfiguration und bei manueller Eingabe.

### Alpha 13.9.38

Einfügevorschau und Rückgängig für Bibliothekskarten und Duplikate. Die Schnelleinstellungen für Custom Cards bieten eine Icon-Auswahlliste.

### Alpha 13.9.39

Mehrere Kartenvorlagen mit gemeinsamer Vorschau einfügen und gemeinsam rückgängig machen.

### Alpha 13.9.40

Speichert Änderungen erst nach erfolgreicher Validierung, prüft die Kennung veröffentlichter Dashboards und bietet eine Zugriffsauswahl beim Veröffentlichen. Ältere Veröffentlichungen können im Manager entkoppelt werden.

### Alpha 13.9.41

Gliedert den Layoutmanager in Tab, Raum und Karten. Die Update-Info zeigt die installierte Rotapfel-Version und meldet verfügbare Updates aus einer zugeordneten Home-Assistant-Update-Entität.

### Alpha 13.9.42

Kompaktere Tab-, Raum- und Kartenaktionen mit größeren primären Schaltflächen und aufklappbaren Aktionsmenüs.

### Alpha 13.9.43

Zeigt alle Aktionen der ausgewählten Karte direkt an.

### Alpha 13.9.44

Ideale Kartengröße ist direkt neben der automatischen Anordnung erreichbar. Korrigiert die Touch-Erkennung in der mobilen Werkzeugleiste.

### Alpha 13.9.45

„Ideale Größe“ verbreitert zu schmale responsive Custom Cards und verwendet ihre unskalierte Inhaltshöhe.

### Alpha 13.9.46

„Ideale Größe“ setzt zu breite Mushroom Entity Cards auf ihre Rotapfel-Standardbreite zurück.

### Alpha 13.9.47

Fügt horizontale und vertikale Beschriftungskarten ohne Entität hinzu.

### Alpha 13.9.48

Erweitert die Kartenauswahl um 69 native Home-Assistant-Kartentypen, darunter Stapel, bedingte Karten und Verbrauchskarten. Nutzt den nativen Karteneditor, sofern verfügbar, und bietet YAML oder JSON zur manuellen Konfiguration.

### Alpha 13.9.49

Lädt die Home-Assistant-Übersetzungen für die Kartenauswahl und den nativen Karteneditor direkt im Rotapfel-Panel. Dadurch erscheinen Feldbeschriftungen und Auswahltexte auch beim direkten Öffnen des Managers.

### Alpha 13.9.50

Automatische Sprachwahl für den Manager mit manueller Auswahl von Deutsch oder Englisch. Dashboards können serverseitig für einzelne Home-Assistant-Benutzerkonten freigegeben werden.

### Alpha 13.9.51

Native Home-Assistant-Karten verwenden für die Rahmenanpassung ihre unskalierte Inhaltshöhe. Der Positionsmanager ändert die Größe erst beim Ziehen mit aktivem Zeiger oder über die ausdrückliche Größenanpassung.

### Alpha 13.9.52

Freigegebene Dashboards erhalten direkte Seitenleisteneinträge. Die automatische Sprache berücksichtigt zuerst die Home-Assistant-Profilsprache und anschließend die Länderregel. Enthält die Rahmenkorrekturen aus Alpha 13.9.51.

### Alpha 13.9.53

Ergänzt englische Texte für Kartenliste, Kartenaktionen, Kartenbibliothek, Kartenkonfiguration, Design und Kartentransfer. Gespeicherte Namen bleiben unverändert.

### Alpha 13.9.54

Erweitert die englische Oberfläche auf Positionierungseditor, Vorlagen, Geräteprofile, Versionsverwaltung, Veröffentlichungsdialoge und Meldungen.

### Alpha 13.9.60

- Navigation und Raumtabs liegen im Rahmen der Positionierungsfläche. **Navigation konfigurieren** öffnet die Einstellungen direkt.
- Freigegebene Dashboards verwenden lesbare Dashboard-, Tab- und Raumadressen.
- Bedienungsanleitung für Darstellung, Navigation und Veröffentlichung ergänzt.

### Alpha 13.9.59

- Unter **Dashboard-Darstellung** lassen sich Raumtabs ausblenden. Das Dashboard zeigt dann die Karten aller Räume des jeweiligen Tabs.
- Dashboard-Navigation und Raumtabs haben eigene Einstellungen für Stil, Schriftgröße, Innenabstand sowie Schrift- und Hintergrundfarben.
- Die Positionierungsfläche zeigt beide Leisten und berücksichtigt ihren Platzbedarf.

### Alpha 13.9.58

- Die Positionierungsfläche zeigt die gewählte Tab-Leiste auch bei einem einzelnen Tab.
- Die Manager-Leiste steht links oben. Die Navigationsleiste erscheint standardmäßig oben mittig. Unter **Dashboard-Darstellung** lässt sie sich auch oben links, unten mittig oder seitlich platzieren.

### Alpha 13.9.57

- Die Frontend-Anzeigen in der Übersicht und im Layout-Editor melden die korrekte Buildnummer.

### Alpha 13.9.56

- Beim Speichern des Layouts übernimmt die bestehende Veröffentlichung Hintergrund, Kiosk-Modus und Navigationsstil. Tab-Hintergründe und Navigationsnamen werden ebenfalls übernommen.
- Die Positionierungsfläche zeigt die konfigurierte Tab-Navigation und berücksichtigt ihre Höhe bei der Kartenanordnung.

### Alpha 13.9.55

Ergänzt Hintergründe für das ganze Dashboard oder einzelne Tabs, globalen Kiosk-Modus und konfigurierbare Tab-Navigation. Entfernt doppelte Überschriften und übernimmt die Korrekturen für die Vorschau und die automatische Anordnung nach Kartentyp.
