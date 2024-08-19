import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-application-list-pie',
  templateUrl: './application-list-pie.component.html',
  styleUrls: ['./application-list-pie.component.css'],
  providers: [DatePipe],
})
export class ApplicationListPieComponent implements OnInit, AfterViewInit {
  @Input() positionId: any;
  @Input() startDate: any;
  @Input() endDate: any;

  chart: any;
  sourceList: any[] = [{}];
  sourceLabels: string[] = [];
  sourceCount: number[] = [];
  requestId: any;
  today: Date = new Date();
  initialLoader: Boolean = false;

  constructor(private apiService: ApiService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initialLoader = true;
    this.requestId = this.positionId ? this.positionId : '';
    this.fetchResumeSource();
  }

  ngAfterViewInit(): void {
    Chart.register(ChartDataLabels);
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['positionId'] && !changes['positionId'].isFirstChange()) {
      if (this.positionId === '') this.fetchResumeSource();
      this.requestId = changes['positionId'].currentValue;
      this.fetchResumeSource();
    } else if (changes['startDate'] && !changes['startDate'].isFirstChange()) {
      this.startDate = changes['startDate'].currentValue;
      this.fetchResumeSource();
    } else if (changes['endDate'] && !changes['endDate'].isFirstChange()) {
      this.endDate = changes['endDate'].currentValue;
      this.fetchResumeSource();
    }
  }
  fetchResumeSource(): void {
    this.initialLoader = true;
    this.sourceList = [];
    this.sourceLabels = [];
    this.sourceCount = [];
    this.apiService.get(`/dashboard/resume-source?fromDate=${this.startDate}&toDate=${this.endDate}&requestId=${this.requestId}`).subscribe((res: any) => {
      if (res?.data && res.data.length > 0) {
        this.sourceList = res.data;
        this.sourceLabels = this.sourceList.map((item: any) => item.sourceName);
        this.sourceCount = this.sourceList.map((item: any) => Number(item.sourcecount));
        this.initialLoader = false
        setTimeout(() => {
          this.createChart();
        }, 10);
      } else {
        this.initialLoader = false;
        this.sourceList = [];
        this.sourceLabels = [];
        this.sourceCount = [];
      }    
    });
  }
  
  createChart(): void {
    const canvasElement = document.getElementById('MyChart') as HTMLCanvasElement;
    if (!canvasElement) {
      // console.error("Canvas element not found");
      return; 
    }
  
    if (this.chart) {
      this.chart.destroy();
    }
  
    if (!this.sourceList || this.sourceList.length === 0) {
      console.warn("No data available for the chart");
      return; 
    }
  
    const chartConfig: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: this.sourceLabels,
        datasets: [{
          data: this.sourceCount,
          backgroundColor: ['#628AFC', '#1790C5', '#005EC9', '#047892', '#3EB2B8'],
          borderColor: ['#628AFC', '#1790C5', '#005EC9', '#047892', '#3EB2B8'],
          fill: false,
          hoverOffset: 5
        }],
      },
      options: {
        responsive: true,
        aspectRatio: 1.5,
        layout: {
          padding: {
            top: 50,
            bottom: 50,
            right: 120,
            left: 120
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'right',
            align: 'center',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
            }
          },
          tooltip: {
            enabled: false
          },
          datalabels: {
            display: false,
          },
        },
      },
      plugins: [
        ChartDataLabels, this.doughnutLabelsLinePlugin
      ],
    };
  
    this.chart = new Chart(canvasElement, chartConfig);
  }
  
  doughnutLabelsLinePlugin = {
    id: 'doughnutLabelsLine',
    afterDraw: (chart: any) => {
      const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
      const center = { x: (left + right) / 2, y: (top + bottom) / 2 };
      const labelPositions: { x: number, y: number }[] = [];
      const minLabelSpacing = 20; // Adjust this to control spacing
      const lineLength = 30; // Length of the line connecting the chart to the label

      chart.data.datasets.forEach((dataset: any, i: number) => {
        chart.getDatasetMeta(i).data.forEach((datapoint: any, index: number) => {
          const { x, y } = datapoint.tooltipPosition();
          const angle = Math.atan2(y - center.y, x - center.x);
          const quadrant = angle < 0 ? 4 : angle <= Math.PI / 2 ? 1 : angle <= Math.PI ? 2 : 3;

          let xLine = center.x + Math.cos(angle) * (width / 2 + lineLength);
          let yLine = center.y + Math.sin(angle) * (height / 2 + lineLength);

          // Check and adjust yLine for overlapping
          let adjustment = 0;
          let foundOverlap = true;
          while (foundOverlap) {
            foundOverlap = false;
            for (let pos of labelPositions) {
              if (Math.abs(yLine - pos.y) < minLabelSpacing) {
                adjustment += minLabelSpacing;
                if (quadrant === 2 || quadrant === 3) {
                  yLine -= adjustment;
                } else {
                  yLine += adjustment;
                }
                foundOverlap = true;
                break;
              }
            }
          }
          labelPositions.push({ x: xLine, y: yLine });

          // Draw line to label
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(xLine, yLine);
          ctx.strokeStyle = dataset.borderColor[index];
          ctx.stroke();

          // Draw label box
          ctx.fillStyle = dataset.backgroundColor[index];
          ctx.fillRect(xLine - 5, yLine - 5, 10, 10); // Adjust for box size
          // Draw label text
          ctx.font = '13px Roboto'; // Default font style for label
          ctx.textAlign = xLine < center.x ? 'right' : 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#575F6E';
          const label = `${chart.data.labels[index]}: `;
          const textX = xLine < center.x ? xLine - 10 : xLine + 15;
          const labelWidth = ctx.measureText(label).width;

          // Draw the label text
          ctx.fillText(label, textX, yLine);

          // Draw the value text with different styling
          ctx.font = 'bold 16px Roboto'; // Increased font size and weight for value
          ctx.fillStyle = '#000000'; // Highlight color for value
          ctx.fillText(dataset.data[index], textX + labelWidth, yLine);
        });
      });
    }
  };

  // doughnutLabelsLinePlugin = {
  //   id: 'doughnutLabelsLine',
  //   afterDraw: (chart: any) => {
  //     const { ctx, chartArea: { top, bottom, left, right } } = chart;
  //     const labelPositions: any[] = [];

  //     chart.data.datasets.forEach((dataset: any, i: any) => {
  //       chart.getDatasetMeta(i).data.forEach((datapoint: { tooltipPosition: () => { x: any; y: any; }; }, index: number) => {
  //         const { x, y } = datapoint.tooltipPosition();
  //         let xLine = right;
  //         let yLine = y;
  //         let extraLine = 30;

  //         switch (index) {
  //           case 0://naukri
  //             xLine = x;
  //             yLine = bottom - 20;
  //             extraLine = 70;
  //             break;
  //           case 1://linkidin
  //             xLine = x;
  //             yLine = bottom + 25;
  //             extraLine = 90;
  //             break;
  //           case 2://indeed
  //             xLine = x;
  //             yLine = bottom + 90;
  //             extraLine = 100;
  //             if (xLine > top) {
  //               yLine = top;
  //             }

  //             break;
  //           case 3://candidate 
  //             xLine = x;
  //             yLine = bottom - 10;
  //             extraLine = 120;
  //             if (xLine > top) {
  //               yLine = top + 20;
  //             }
  //             break;
  //           case 4://reference
  //             xLine = x;
  //             yLine = bottom - 20;
  //             extraLine = 100;
  //             if (xLine > top) {
  //               yLine = top + 60;
  //             } break;
  //           default:
  //             break;
  //         }
  //         let finalYLine = yLine;

  //         for (const pos of labelPositions) {
  //           if (Math.abs(finalYLine - pos) < 30) {
  //             finalYLine += 30 * (yLine > pos ? 1 : -1);
  //           }
  //         }
  //         labelPositions.push(finalYLine);

  //         ctx.beginPath();
  //         ctx.moveTo(x, y);
  //         ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
  //         ctx.fill();
  //         ctx.moveTo(x, y);
  //         ctx.lineTo(xLine, finalYLine);
  //         ctx.lineTo(xLine + extraLine, finalYLine);
  //         ctx.strokeStyle = "black";
  //         ctx.stroke();

  //         const boxSize = 10;
  //         ctx.fillStyle = dataset.backgroundColor[index];
  //         ctx.fillRect(xLine + extraLine, finalYLine - boxSize / 2, boxSize, boxSize);

  //         ctx.font = '14px Roboto';
  //         ctx.fontWeight = 'bold';

  //         const textXPosition = extraLine >= 0 ? 'left' : 'right';
  //         const plusFivePx = extraLine >= 0 ? 18 : -18;

  //         ctx.textAlign = textXPosition;
  //         ctx.textBaseline = 'middle';
  //         ctx.fillStyle = "#575F6E";

  //         const label = chart.data.labels[index] + ':';
  //         const value = chart.data.datasets[0].data[index];

  //         ctx.fillText(label, xLine + extraLine + boxSize + 10, finalYLine);
  //         ctx.font = 'bold 16px Roboto';
  //         if(this.sourceLabels?.length === 1) {
  //           ctx.fillText(value, xLine + extraLine + boxSize + 77, finalYLine);
  //         }else{
  //           if (index === 0 || index === 2 || index === 1) ctx.fillText(value, xLine + extraLine + boxSize + 67, finalYLine);
  //           if (index === 3 || index === 4) ctx.fillText(value, xLine + extraLine + boxSize + 90, finalYLine);
  //         }  
  //       });
  //     });
  //   },
  // };

  // doughnutLabelsLinePlugin = {
  //   id: 'doughnutLabelsLine',
  //   afterDraw: (chart: any) => {
  //     const { ctx, chartArea: { top, bottom, left, right } } = chart;
  //     const centerX = (left + right) / 2;
  //     const centerY = (top + bottom) / 2;
  //     const radius = (Math.min(right - left, bottom - top) / 2) * 0.9;

  //     chart.data.datasets.forEach((dataset: any, i: any) => {
  //       chart.getDatasetMeta(i).data.forEach((datapoint: { tooltipPosition: () => { x: any; y: any; }; }, index: number) => {
  //         const { x, y } = datapoint.tooltipPosition();
  //         const angle = Math.atan2(y - centerY, x - centerX);
  //         const xLine = centerX + Math.cos(angle) * (radius + 30);
  //         const yLine = centerY + Math.sin(angle) * (radius + 30);
  //         const extraLine = 30 * Math.sign(Math.cos(angle));

  //         ctx.beginPath();
  //         ctx.moveTo(x, y);
  //         ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
  //         ctx.fill();
  //         ctx.moveTo(x, y);
  //         ctx.lineTo(xLine, yLine);
  //         ctx.lineTo(xLine + extraLine, yLine);
  //         ctx.strokeStyle = "black";
  //         ctx.stroke();

  //         const boxSize = 10;
  //         ctx.fillStyle = dataset.backgroundColor[index];
  //         ctx.fillRect(xLine + extraLine, yLine - boxSize / 2, boxSize, boxSize);

  //         ctx.font = '14px Roboto';
  //         ctx.fontWeight = 'bold';

  //         const textXPosition = extraLine >= 0 ? 'left' : 'right';

  //         ctx.textAlign = textXPosition;
  //         ctx.textBaseline = 'middle';
  //         ctx.fillStyle = "#575F6E";

  //         const label = chart.data.labels[index] + ':';
  //         const value = chart.data.datasets[0].data[index];

  //         ctx.save();
  //         ctx.translate(xLine + extraLine + boxSize + 10, yLine);
  //         ctx.rotate(angle);
  //         ctx.fillText(label, 0, 0);
  //         ctx.restore();

  //         ctx.save();
  //         ctx.translate(xLine + extraLine + boxSize + 30, yLine);
  //         ctx.rotate(angle);
  //         ctx.font = 'bold 16px Roboto';
  //         ctx.fillText(value.toString(), 0, 0);
  //         ctx.restore();
  //       });
  //     });
  //   },
  // };



}
