[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead('C:\Users\qc1uk\Downloads\ЛЕНДІНГ_БРОНЕЖИЛЕТ_ДЛЯ_ФОП.docx')
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::UTF8)
$xml = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

$doc = New-Object System.Xml.XmlDocument
$doc.LoadXml($xml)
$ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

$paragraphs = $doc.SelectNodes('//w:p', $ns)
$output = @()
foreach ($p in $paragraphs) {
    $texts = $p.SelectNodes('.//w:t', $ns)
    $line = ''
    foreach ($t in $texts) {
        $line += $t.InnerText
    }
    if ($line.Trim() -ne '') {
        $output += $line
    }
}
$output -join "`n" | Out-File -FilePath 'C:\Users\qc1uk\Desktop\Лендинг\docx_content.txt' -Encoding UTF8
Write-Output 'Done'
