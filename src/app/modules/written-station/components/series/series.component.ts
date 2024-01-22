import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { ActivatedRoute } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.css'],
  animations: [
    trigger('toggleAnimation', [
    state('visible', style({ width: '25%' })),
    state('hidden', style({ width: '0', transform: 'translateX(100%)' })),
    transition('visible => hidden', animate('.9s ease-out')), // Shorter duration for hiding
    transition('hidden => visible', animate('.5s ease-in-out')), // Longer duration for becoming visible
    ]),
    ],
})
export class SeriesComponent implements OnInit{
  series_list: any = [];
  activeSeries: any;
  candidates_list: any;
  series1: any = [];
  series2: any = [];
  series3: any = [];
  selectedCandidate: any;
  pointerPosition: any;
  dragEnteredSeries: any;
  candidates: any = [];
  biggieMoveSelected: boolean = false;
  activeBucket: any;
  requestId:any;
  isTaskDetailsOpen : boolean = false;
  serviceIds : any = [];
  questions_list: any = [];
  idListOpen : boolean = false;
  selectedQuestionId : any;
  selectedQuestionName : any;
  activeDropdownSeries: any = null;
  selectedQuestions: { [key: string]: { id: any, name: any } } = {};
  requestData : any = [];
  serviceId : any = [];
  payload_series_list : any = [];
  constructor(private http: HttpClient, private route: ActivatedRoute) {

    this.route.queryParams.subscribe(params => {
      this.requestId = params['requestId'];
      console.log(" this.requestId", this.requestId);
      

    });
  }
  ngOnInit(): void {
    this.fetchcandidates();
    this.fetchQuestions();
    // console.log("this.series_list before", this.series_list);
    this.fetchCandidatesWithSeries();
  }
  fetchcandidates(): void {
    this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res: any) => {
      // console.log("fetch candidates", res);
      this.candidates_list = res.candidates;
      this.candidates = this.candidates.candidate;
      // console.log("this.candidates_list", this.candidates_list);
      this.candidates_list.forEach((candidate:any) => {
        if(candidate.serviceId){
          this.serviceIds.push(candidate.serviceId);
        }
        // console.log("Service IDs:", this.serviceIds);
      });

    })
  }

fetchQuestions():void{
  this.http.get(`${environment.api_url}/written-station/questions`).subscribe((data:any) => {
    // console.log("questions",data);
    
    this.questions_list = data.data;

  })
}

fetchCandidatesWithSeries():void{
  this.http.get(`${environment.api_url}/screening-station/list-batch/${this.requestId}?station=2`).subscribe((res => {
    // console.log("fetchCandidatesWithSeries",res);
    
  }))
}

  seriesBoxClick(series: any) {
    this.series_list.forEach((s: any) => s.active = false);
    series.active = true;
    this.activeSeries = series;
    this.activeDropdownSeries = series;

  }
  allowDrop(ev: any) {
    ev.preventDefault();
  }
  onDrop(event: any) {
    // console.log("hhfudghfui");

    this.selectedCandidate = event.item.data;
    // console.log("this.selectedCandidate", this.selectedCandidate);

  }
  moved(event: any) {
    // console.log("entering pointer position");

    this.pointerPosition = event.pointerPosition;
    // console.log(event.pointerPosition);
  }
  itemDropped(event: any, series: any) {

    // console.log("item dropped");

  }

  createSeries(): void {

    // const newSeriesName = this.series_list.name++;
    const newSeriesName = `Series${this.series_list.length + 1}`;
    // console.log("newSeriesName", newSeriesName);

    const newSeries = { name: newSeriesName ,questions: []  };
    // console.log("newSeries", newSeries);

    this.series_list.push(newSeries);
    // console.log("after this.series_list", this.series_list);

    this.activeSeries = newSeries;
    this.activeDropdownSeries = newSeries;
  }
  dragStart(event: any, candidate: any) {
    // console.log("Drag Start");
    event.dataTransfer.setData('text/plain', JSON.stringify(candidate));

  }

  dragOver(event: DragEvent) {
    // console.log("Drag Over Series");
    event.preventDefault();
  }

  productDrop(event: any, series: any) {
    // console.log("Product Drop Series");
    event.preventDefault();
    const candidateData = event.dataTransfer.getData('text/plain');
    const candidate = JSON.parse(candidateData);

    // Remove the candidate from its previous series
    this.series_list.forEach((s: any) => {
      if (s?.candidates) {
        s.candidates = s.candidates.filter((c: any) => c?.candidateId !== candidate?.candidateId);
      }
    });

    // Remove the candidate from the candidates_list
    this.candidates_list = this.candidates_list.filter((c: any) => c?.candidateId !== candidate?.candidateId);

    // Add the dropped candidate to the candidates array of the new series
    series.candidates = series.candidates || [];
    series.candidates.push(candidate);
 // Create a new array with only serviceId values for each series
 this.payload_series_list = this.series_list.map((s: any) => {
  this.serviceId = s.candidates.map((c: any) => c?.serviceId);
  if (s.candidates) {
    return {
      questions: s.questions,
      // candidates: s.candidates.map((c: any) => c?.serviceId),
    };
  }
  return s;

});
    // Update the series_list
    // console.log("New Array:",  this.payload_series_list);
    this.series_list = [...this.series_list];
    // console.log("Candidate dropped:", candidate);
    // console.log("Dropped into Series:", series);
    console.log("Series with Candidates:", this.series_list);
    event.preventDefault();
    event.stopPropagation();
  }

  // Handle the dragover event for the series boxes
  dragOverSeries(event: DragEvent, series: any) {
    event.preventDefault();
    this.dragEnteredSeries = series;

  }
  approve():void{
   
  }
  // approve(): void {
  //   // const requestData = [];
  
  //   // Iterate over each series
  //   this.series_list.forEach((series: any) => {
     
  //       // Iterate over each candidate in the series
  //       series.candidates.forEach((candidate: any) => {
  //         // Ensure the candidate has a serviceId
         
  //           this.serviceId.push(candidate.serviceId);
          
  //       });
  
  //       // Add series data only if there are serviceIds
       
  //         const seriesData = {
  //           questionAssignee: null,
  //           questionId: this.selectedQuestionId,
  //           serviceIds: this.serviceId,
  //           // Add any other data you need from the series
  //         };
  //         this.requestData.push(seriesData);
  //       console.log("this.requestData",this.requestData);
        
      
  //   });
  
  //   // Make the API call with the gathered data
   
  //     this.http.post(`${environment.api_url}/written-station/assign-question`, this.requestData).subscribe((res: any) => {
  //       console.log("approve series", res);
  //     });
    
  // }
  
  
  toggleTaskDetails() {
    // if (this.isTaskDetailsOpen) {
    this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
    this.activeDropdownSeries = null; 
    // } else {
    // this.isTaskDetailsOpen = !this.isTaskDetailsOpen;
    // }
  }

  selectQuestion(id:any,name:any):void{
    // this.questions_list = false;
   
    // this.questions_list = true;
    if (this.activeSeries && this.selectedQuestionId !== id) {
      this.selectedQuestionId = id;
      console.log("this.selectedQuestionId",this.selectedQuestionId);
      
      this.selectedQuestionName = name;
      this.selectedQuestions[this.activeSeries.name] = { id, name };
      this.activeSeries.questions = [name]; 
      this.activeDropdownSeries = null;
    }
  }
  // check the question is already selected or not

isQuestionSelected(series: any, question: any): void {
   this.selectedQuestions[series.name]?.id === question.questionId;
   console.log("this.selectedQuestions[series.name]?.id ",this.selectedQuestions[series.name]?.id );
   
}

assignQuestion():void{
 
  const requestData = {
    questionAssignee : null,
    questionId : this.selectedQuestionId,
    questionServiceId:this.serviceId
    // serviceIds : this.serviceIds
  }
  this.http.post(`${environment.api_url}/written-station/assign-question`,requestData).subscribe((res:any) => {
    console.log("approve seriies",res);
    
  })
}

 
}
