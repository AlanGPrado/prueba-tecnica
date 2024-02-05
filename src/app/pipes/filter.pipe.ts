import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[] | null, searchText: string): any[] {
    if (!items || !searchText) {
      return items || [];
    }

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // Adjust the conditions based on your data structure
      return (
        item.id.toString().includes(searchText) ||
        item.name.toLowerCase().includes(searchText) ||
        item.age.toString().includes(searchText)
      );
    });
  }

}
