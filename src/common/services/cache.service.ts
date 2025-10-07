import { Inject, Injectable } from "@nestjs/common";
import { Command, Positional } from "nestjs-command";
import _ from 'lodash'

type Cache = {
  key: string,
  value: any,
}

let cache: Cache[] = []

@Injectable()
export class CacheService {
  set(key: string, value: any) {
    return null;
    
    _.remove(cache, item => item.key === key)

    return cache.push({
      key,
      value
    })
  }

  get(key: string): Promise<any> {
    const record: Cache = _.find(cache, { key })

    return record ? record.value : null;
  }

  @Command({
    command: 'cache:clear'
  })
  clear() {
    cache = [];
    return true;
  }

  @Command({
    command: 'cache:delete <key>'
  })
  delete(
    @Positional({
      name: 'key',
      type: 'string'
    })
    key: string
  ) {
    _.remove(cache, item => item.key === key)

    return true;
  }
}
