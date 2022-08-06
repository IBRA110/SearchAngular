import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { 
	map, 
	debounceTime, 
	distinctUntilChanged, 
	switchMap, 
	mergeMap, 
	tap,
	catchError,
	filter} from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { face, user } from './interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'searchGitHub';
	
	url: string = 'https://api.github.com/search/users?q=';
	
	search$: FormControl = new FormControl
	items: user[] = []

	ngOnInit(){
		this.search$ = new FormControl('')
		this.search$.valueChanges
		.pipe(
			//map(e => e.target.value) # Позволяет извлеч только значение, но у нас уже и так все норм
			debounceTime(1000),
			// Время которое стрим должен подождать в милисекундах
			distinctUntilChanged(),
			// Если после изменения ничего не поненялось от пред запроса, то мы ничего не меняем
			tap(() => this.items = []),
			// очищаем html для нового ввода
			filter(v => v.trim()),
			// фильтруем пустую строку что бы не отправлять пустой запрос
			switchMap(v => ajax.getJSON<face>(this.url + v).pipe(
					catchError(err => EMPTY)
					// Поймали ошибку ajax если поле пустое
				)),
			// Позволяет переключится на другой стрим
			// ajax позволяет отправлять get запросы
			map(response => response.items),
			// Вытаскиваем только нужные данные
			mergeMap(items => items)
			// Возвращаем каждый объект списка
		)
		.subscribe((value) => {
			console.log(value)
			this.items.push(value)
		})
	}
		
}
