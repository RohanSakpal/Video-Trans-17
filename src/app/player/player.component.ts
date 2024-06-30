import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GcpDataService } from '../services/gcp-data.service';
import { GeminiService } from '../services/gemini.service';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from "../time-format.pipe";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-player',
    standalone: true,
    templateUrl: './player.component.html',
    styleUrl: './player.component.scss',
    imports: [FormsModule, TimeFormatPipe,CommonModule,RouterLink]
})
export class PlayerComponent {
  currentMsg: string = '';
  Category: string = '';
  videoName: string = '';
  videoFrame: string = '';

  videoId: any;
  video: any;
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  startTime!: number;
  videoElm!: HTMLVideoElement;
  currentTimeIndex: number = 0;
  isFullTranscript: boolean = false;
  //prompt:string = 'Hi Gemini How Are you?';
  selectedTranscripts:any[] = [];
  prompt:string = 'Can you write me content for this transcription or suggest any content ideas';
  chatHistory:any[] = [];
  constructor(private route: ActivatedRoute, private gcp: GcpDataService,private geminiServ:GeminiService) {
    this.geminiServ.getMessageHistory().subscribe((res:any)=> {
      if(res) {
        this.prompt = '';
        this.selectedTranscripts = [];
        this.video.dataFull?.map((m:any) =>{
           m['status'] = false})
        this.chatHistory.push(res);
      }
    })
   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.videoId = params.get('id');
      this.loadVideo(this.videoId);
    });
  }

  ngAfterViewInit(): void {
    this.videoElm = this.myVideo.nativeElement;
  }

  loadVideo(id: string): void {
    this.gcp.getVideoData(id).subscribe((res: any) => {
      this.video = {
        v_id: res.FullTransquery[0].v_id,
        video_link: res.FullTransquery[0].video_link,
        data: res.MatchTrascQuery,
        dataFull : res.FullTransquery?.map((m:any) =>{
          return { ...m, status : false}}),
      }
      this.Category = this.video.dataFull[0].category;
      this.videoName= this.video.dataFull[0].videoname;
      this.startVideoAtTimeIfNeeded();
    }, (err: any) => {
      console.log(err);
    })
  }

  startVideoAtTimeIfNeeded(): void {
    if (this.video && this.videoElm) {
      if(this.video.data.length > 0) {
        if (!isNaN(this.video.data[this.currentTimeIndex].start) && this.video.data[this.currentTimeIndex].start >= 0) {
          this.videoElm.src = this.video.video_link; // Set the video source
          this.videoElm.currentTime = this.video.data[this.currentTimeIndex].start;
          this.videoElm.play();
        } else {
          alert("Please enter a valid start time.");
        }
      } else {
        this.isFullTranscript = true;
        if (!isNaN(this.video.dataFull[this.currentTimeIndex].start) && this.video.dataFull[this.currentTimeIndex].start >= 0) {
          this.videoElm.src = this.video.video_link; // Set the video source
          this.videoElm.currentTime = this.video.dataFull[this.currentTimeIndex].start;
          this.videoElm.play();
        } else {
          alert("Please enter a valid start time.");
        }
      }
    }
  }

  timeForwardBackward(startime:any) {
    this.videoElm.currentTime = startime
    this.videoElm.play();
  }

  onNextClick(): void {
    this.currentTimeIndex++;
    if (this.currentTimeIndex < this.video.time.length) {
      const nextSegment = this.video.time[this.currentTimeIndex];
      this.videoElm.currentTime = nextSegment.Start;
      this.videoElm.play();
    } else {
      alert("Please enter a valid start time.");
    }
  }

  onTimeUpdate(): void {
    this.currentMsg = '';
    this.videoFrame = ''
    let number = this.videoElm.currentTime;
    for (let i = 0; i < this.video.data.length; i++) {
      if (number >= this.video.data[i].start && number <= this.video.data[i].end) {
        this.videoFrame = this.convertSecondsToMMSS(this.video.data[i].start) + " - " + this.convertSecondsToMMSS(this.video.data[i].end) + " Minutes"
        this.currentMsg = this.video.data[i].speaker + " : " + this.video.data[i].transcript;
      }
    }
  }

  convertSecondsToMMSS(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${this.padToTwoDigits(minutes)}:${this.padToTwoDigits(remainingSeconds)}`;
  }

  private padToTwoDigits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  isCurrentTimeInRange(startTime: number, endTime: number): boolean {
    if (!this.videoElm) return false; // Ensure video element is available
  
    const currentTime = this.videoElm.currentTime;
    return currentTime >= startTime && currentTime <= endTime;
  }

  transcriptChange() {
    this.isFullTranscript = !this.isFullTranscript;
  }

  sendData() {
    let arrayString = this.selectedTranscripts.join(', ');
    let validPrompt = arrayString + this.prompt;
    if(validPrompt) {
      let msg = this.geminiServ.generateText(this.prompt);
    }
  }

  onCheckboxChange(event: any, transcript: string,index:number): void {
    if (event.target.checked) {
      this.selectedTranscripts.push(transcript);
      this.video.dataFull[index].status = true;
    } else {
      const index = this.selectedTranscripts.indexOf(transcript);
      if (index > -1) {
        this.selectedTranscripts.splice(index, 1);
      }
    }
  }
}