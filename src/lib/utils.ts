import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

interface Column {
  text: string;
  dataField: string;
  formatter?: (value: any) => React.ReactNode;
}

const NEXT_PUBLIC_CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

// Function to convert image URL to base64
const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  console.log("🚀 ~ getImageAsBase64 ~ imageUrl:", imageUrl);
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return '';
  }
};

const getBase64Image = (imgUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      // Remove the data URL prefix when resolving
      resolve(canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpg|jpeg);base64,/, ''));
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
      reject(error);
    };
    img.src = `${imgUrl}?t=${new Date().getTime()}`;
  });
};

export const exportToPDF = async (
  columns: Column[],
  data: any[],
  title: string = 'Table Data',
  filters?: any,
  siteOptions?: { value: string, label: string }[],
  zoneOptions?: { value: string, label: string }[]
) => {
  try {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    
    // Increase space for header
    const headerSpace = 25;
    const availableHeight = pageHeight - (margin * 2) - headerSpace;
    const rowHeight = (availableHeight - 20) / 10;
    const baseURL = process.env.NEXT_PUBLIC_CDN_URL;

    // Load both logos with transparent background
    const [leftLogoBase64, rightLogoBase64] = await Promise.all([
      new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx!.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.onerror = reject;
        img.src = '/main_logo.svg';
      }),
      new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx!.clearRect(0, 0, canvas.width, canvas.height);
          ctx?.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png').split(',')[1]);
        };
        img.onerror = reject;
        img.src = '/logo2.png';
      })
    ]);

    // Logo dimensions
    const leftLogoWidth = 30; // Increased width for left logo
    const logoHeight = 10;
    const rightLogoWidth = 20;

    // Calculate positions for centered layout
    const titleWidth = doc.getStringUnitWidth(title) * 16 / doc.internal.scaleFactor;
    const centerX = pageWidth / 2;

    // Add left logo
    try {
      doc.addImage(
        leftLogoBase64,
        'PNG',
        margin,
        margin,
        leftLogoWidth,
        logoHeight,
        undefined,
        'FAST'
      );
    } catch (error) {
      console.error('Error adding left logo to PDF:', error);
    }

    // Add centered title
    doc.setFontSize(16);
    doc.text(title, centerX - (titleWidth / 2), margin + (logoHeight / 2));

    // Add right logo
    try {
      doc.addImage(
        rightLogoBase64,
        'PNG',
        pageWidth - margin - rightLogoWidth,
        margin,
        rightLogoWidth,
        logoHeight,
        undefined,
        'FAST'
      );
    } catch (error) {
      console.error('Error adding right logo to PDF:', error);
    }
    let yPosition = margin + logoHeight + 10;

    // Add filters below the header
    if (filters) {
      doc.setFontSize(10);
      for (const key in filters) {
        if (filters[key] && filters[key].length > 0 && key !== 'startDate' && key !== 'endDate') {
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
          let filterText = '';
          if (key === 'sites' && siteOptions) {
            const siteNames = filters[key].map((id: string) => siteOptions.find(site => site.value === id)?.label).join(', ');
            filterText = ` ${siteNames}`;
          } else if (key === 'zones' && zoneOptions) {
            const zoneNames = filters[key].map((id: string) => zoneOptions.find(zone => zone.value === id)?.label).join(', ');
            filterText = ` ${zoneNames}`;
          } else {
            const capitalizedValues = Array.isArray(filters[key]) ? filters[key].map((value: string) => value.charAt(0).toUpperCase() + value.slice(1)).join(', ') : filters[key];
            filterText = ` ${capitalizedValues}`;
          }
          doc.setFont('helvetica', 'bold');
          doc.text(`${capitalizedKey}:`, margin, yPosition);
          doc.setFont('helvetica', 'normal');
          const splitText = doc.splitTextToSize(filterText, pageWidth - 2 * margin - doc.getTextWidth(`${capitalizedKey}: `));
          splitText.forEach((line:any, index:any) => {
            doc.text(line, margin + doc.getTextWidth(`${capitalizedKey}: `), yPosition + (index * 5));
          });
          yPosition += splitText.length * 5;
        }
      }
      if (filters.startDate && filters.endDate) {
        const timeText = `from ${new Date(filters.startDate).toLocaleString()} to ${new Date(filters.endDate).toLocaleString()}`;
        doc.setFont('helvetica', 'bold');
        doc.text('Time:', margin, yPosition);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(timeText, pageWidth - 2 * margin - doc.getTextWidth('Time: '));
        splitText.forEach((line:any, index:any) => {
          doc.text(line, margin + doc.getTextWidth('Time: '), yPosition + (index * 5));
        });
        yPosition += splitText.length * 5;
      }
      yPosition += 5; // Add extra space between filters and table
    }

    // Adjust table starting position
    const tableStartY = yPosition;

    // Process and prepare table data with images
    const tableData = await Promise.all(
      data.map(async (row) => {
        return await Promise.all(
          columns.map(async (col) => {
            if ((col.dataField === 'image'|| col.dataField === 'imageFile') && row[col.dataField]) {
              try {
                const fullImageUrl = `${baseURL}${row[col.dataField]}`;
                const base64Image = await getBase64Image(fullImageUrl);
                return {
                  content: base64Image,
                  type: 'image',
                  imageType: 'JPEG',
                  width: 15, // Reduced size
                  height: 15, // Reduced size
                  cell: { padding: 1 }
                };
              } catch (error) {
                console.error('Error processing image:', error);
                return '';
              }
            }
            if (col.dataField === 'siteName' || col.dataField === 'zoneName') {
              return row[col.dataField] || '';
            }
            return row[col.dataField]?.toString() || '';
          })
        );
      })
    )

    autoTable(doc, {
      head: [columns.map(col => col.text)],
      body: tableData,
      startY: tableStartY, // Use new starting position
      styles: { 
        fontSize: 7, // Reduced font size
        cellPadding: 1, // Reduced padding
        overflow: 'linebreak',
        cellWidth: 'wrap',
        minCellHeight: rowHeight,
        valign: 'middle'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        minCellHeight: rowHeight / 1.5
      },
      columnStyles: {
        [columns.findIndex(col => col.dataField === 'image')]: {
          cellWidth: 24, // Reduced cell width
          cellPadding: 1,
          valign: 'middle',
          halign: 'center'
        }
      },
      // Add these pagination settings
      pageBreak: 'auto',
      rowPageBreak: 'avoid',
      showFoot: 'lastPage',
      bodyStyles: {
        minCellHeight: rowHeight
      },
      willDrawCell: function(data) {
        if (!data.cursor) return true;
        
        const remainingPageSpace = doc.internal.pageSize.height - data.cursor.y;
        if (data.row.height > remainingPageSpace && data.cursor.y > margin + 8) {
          doc.addPage();
          data.cursor.y = margin;
          return false;
        }
        return true;
      },
      didParseCell: function(data) {
        if (data.cell.raw && typeof data.cell.raw === 'object' && (data.cell.raw as any).type === 'image') {
          data.cell.text = [];
        }
      },
      didDrawCell: function(data) {
        if (data.cell.raw && typeof data.cell.raw === 'object' && (data.cell.raw as any).type === 'image') {
          try {
            const image = data.cell.raw as any;
            const cell = data.cell;
            
            // Center the image in the cell
            const x = cell.x + (cell.width - image.width) / 2;
            const y = cell.y + (cell.height - image.height) / 2;

            doc.addImage(
              image.content,
              image.imageType,
              x,
              y,
              image.width,
              image.height,
              undefined,
              'NONE'
            );
          } catch (error) {
            console.error('Error drawing cell:', error);
          }
        }
      }
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const exportToExcel = async (
  columns: Column[],
  data: any[],
  filename: string = 'table-data'
) => {
  const baseURL = process.env.NEXT_PUBLIC_CDN_URL;
  
  // Filter out image column
  const xyz = columns.filter(col => col.dataField !== 'image');
  const filteredColumns = xyz.filter(col => col.dataField !== 'imageFile');

  // Create CSV content without image column
  const csvRows = [
    // Headers without image column
    filteredColumns.map(col => col.text).join(','),
    // Data rows without image column
    ...data.map(row => 
      filteredColumns.map(col => {
        const cellValue = row[col.dataField]?.toString() || '';
        return `"${cellValue.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];

  const csvContent = '\ufeff' + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};